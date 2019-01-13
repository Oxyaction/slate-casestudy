
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  readonly orderId: number;

  @IsString()
  @IsNotEmpty()
  readonly cardNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly expiresMonth: number;

  @IsString()
  @IsNotEmpty()
  readonly expiresYear: number;

  @IsString()
  @IsNotEmpty()
  readonly cvv: number;
}
