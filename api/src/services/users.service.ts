import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { formatWhatsappNumber } from 'src/helpers/whatsappNumberHelper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.userRepository.softDelete(id);
  }

  findByWhatsAppNumber(number: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { whatsappNumber: formatWhatsappNumber(number) },
    });
  }
}
