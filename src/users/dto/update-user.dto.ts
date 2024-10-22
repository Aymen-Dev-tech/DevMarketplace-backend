import { IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(10)
  phoneNumber: string;
}
