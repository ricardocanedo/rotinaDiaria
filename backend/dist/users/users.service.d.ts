import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        name: string;
        email: string;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        email: string;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        email: string;
        id: number;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        name: string;
        email: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        email: string;
        id: number;
    }>;
}
