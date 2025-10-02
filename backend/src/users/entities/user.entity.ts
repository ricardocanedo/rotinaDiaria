import { ApiProperty } from '@nestjs/swagger';

export class User {
    @ApiProperty({ example: 1, description: 'ID do usuário' })
    id: number; 

    @ApiProperty({ example: 'maria@exemplo.com', description: 'Email do usuário' })
    email: string;    

    @ApiProperty({ example: 'Maria Silva', description: 'Nome do usuário' })
    name: string;
}