
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class PaymentDto {
  @IsInt()
  @IsNotEmpty()
  readonly amount: number;

  @IsInt()
  @IsNotEmpty()
  readonly orderId: number;

  @IsString()
  @IsNotEmpty()
  readonly cardNumber: string;

  @IsInt()
  @IsNotEmpty()
  readonly expiresMonth: number;

  @IsInt()
  @IsNotEmpty()
  readonly expiresYear: number;

  @IsInt()
  @IsNotEmpty()
  readonly cvv: number;
}
