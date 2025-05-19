import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'rafa', description: 'Unique username' })
  username: string;

  @ApiProperty({ example: 'Rafael', description: 'First name' })
  firstname: string;

  @ApiProperty({ example: '5551998091111', description: 'Whatsapp number' })
  whatsappNumber: string;

  @ApiProperty({ example: 'Rodrigues', description: 'Last name' })
  lastname: string;

  @ApiProperty({ example: '123123', description: 'User password' })
  password: string;

  @ApiProperty({ example: 'rafael@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({
    example: 'cus_ABC123',
    description: 'Stripe customer identifier',
    required: false,
  })
  stripeCustomerId?: string;
}
