import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findOne(id: string): Promise<{
        name: string;
        email: string;
        id: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        name: string;
        email: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        email: string;
        id: number;
    }>;
}
