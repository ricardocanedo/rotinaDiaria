import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Maria Silva', minLength: 3, maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    @Length(3, 255)
    name: string;

    @ApiProperty({ example: 'maria@exemplo.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;  

    @ApiProperty({ example: 'senhaSegura123', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @Length(6, 255)
    password: string;
}
