import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto || !createUserDto.email || !createUserDto.name) {
      throw new HttpException(
        'Invalid request body: name and email are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.prisma.user.create({
      data:  { ...createUserDto},
    });

    return newUser;
  }

 async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
   
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  } 

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: {
            email: updateUserDto.email,
            NOT: { id },
        },
      });
      if (emailExists) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {...updateUserDto},
    });
    return updatedUser;
  }

  async remove(id: number) {
     const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const deletedUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return deletedUser;
  }
}
