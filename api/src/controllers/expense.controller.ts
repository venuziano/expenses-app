import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { CreateExpenseDto } from 'src/dto/expense/create-expense.dto';
import { UpdateExpenseDto } from 'src/dto/expense/update-expense.dto';
import { Expense } from 'src/entities/expense.entity';
import { ExpenseService } from 'src/services/expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateExpenseDto })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: String,
    // type: Expense,
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  create(@Body() createExpenseDto: CreateExpenseDto): Promise<string> {
    // create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expenseService.create(createExpenseDto);
  }

  // @Post()
  // create(@Body() createExpenseDto: CreateExpenseDto) {
  //   return this.expenseService.create(createExpenseDto);
  // }

  @Get()
  findAll() {
    return this.expenseService.findAll();
  }

  @Get('/by/userId')
  @ApiOperation({ summary: 'Get user expenses' })
  @ApiCreatedResponse({
    description: 'User expense retrieved successfully',
    type: Expense,
    // type: Expense,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  findAllByUserId() {
    return this.expenseService.findAllByUserId();
  }

  @Get('by/user/email/:email')
  @ApiOperation({ summary: 'Get user expenses' })
  @ApiParam({
    name: 'email',
    description: 'User email address',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'User expense retrieved successfully',
    type: Expense,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  findAllByUserEmail(@Param('email') email: string) {
    console.log('email:', email); // now will log the actual value
    return this.expenseService.findAllByUserEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(+id);
  }
}
