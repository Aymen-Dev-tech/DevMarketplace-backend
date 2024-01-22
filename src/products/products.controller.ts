import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { SellersService } from 'src/sellers/sellers.service';
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly sellerService: SellersService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('ProductPicture[]', 5, {
      storage: diskStorage({
        destination: './uploads/',
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            '.' +
            file.mimetype.split('/')[1];
          cb(null, file.fieldname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    //create the product
    const { userId } = req.user;
    const { id } = await this.sellerService.findOneByUserId(userId);
    createProductDto.sellerId = id;
    const product = await this.productsService.create(createProductDto);
    //retrieve full paths
    const paths: string[] = [];
    files.forEach((file) => {
      paths.push(path.resolve(file.path));
    });
    // saving pictures paths
    const insert = paths.map(async (path) => {
      await this.productsService.createProductPictures({
        url: path,
        productId: product.id,
      });
    });
    Promise.all(insert);
    return product;
  }

  @Get()
  findAll(@Req() req) {
    const sellerId = req.user?.sub;
    return this.productsService.findAll(sellerId);
  }
  @Get('stat')
  stat(@Req() req) {
    const sellerId = req.user.sub;
    return this.productsService.stat(sellerId);
  }

  @Get('types')
  getTypes() {
    return this.productsService.getTypes();
  }

  @Get('tech')
  getTech(@Query('type') type: string) {
    return this.productsService.getTech(type);
  }

  @Get('search')
  search(@Query('value') value: string) {
    return this.productsService.search(value);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
