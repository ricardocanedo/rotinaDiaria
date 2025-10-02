import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request body or user already exists.' })
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('POST /users payload:', createUserDto);
    const result = await this.usersService.create(createUserDto);
    console.log('POST /users result:', result);
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: 200, description: 'List of users returned.' })
  async findAll() {
    const result = await this.usersService.findAll();
    console.log('GET /users result:', result);
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    console.log('GET /users/:id params:', { id });
    const result = await this.usersService.findOne(+id);
    console.log('GET /users/:id result:', result);
    return result;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request body or email already exists.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('PATCH /users/:id params and payload:', { id, updateUserDto });
    const result = await this.usersService.update(+id, updateUserDto);
    console.log('PATCH /users/:id result:', result);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string) {
    console.log('DELETE /users/:id params:', { id });
    const result = await this.usersService.remove(+id);
    console.log('DELETE /users/:id result:', result);
    return result;
  }
}
