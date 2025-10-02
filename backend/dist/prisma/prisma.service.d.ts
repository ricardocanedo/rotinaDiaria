import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '../../generated/prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
