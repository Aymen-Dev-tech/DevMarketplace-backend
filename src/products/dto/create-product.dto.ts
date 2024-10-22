import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  id: number;
  @IsOptional()
  isSold: boolean;
  sellerId: number;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsOptional()
  DamoURL: string;
  @IsNotEmpty()
  @IsNumber()
  typeId: number;
  @IsNotEmpty()
  @IsNumber()
  techId: number;
  @IsOptional()
  ChargilyPayId: string;
}
