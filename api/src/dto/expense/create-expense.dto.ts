import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Gastei R$ 500 no mercado hoje' })
  message: string;

  @ApiProperty({ example: 2 })
  userId?: number | null;
}
