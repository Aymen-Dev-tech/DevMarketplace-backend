import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SellersModule } from 'src/sellers/sellers.module';

@Module({
  imports: [SellersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
