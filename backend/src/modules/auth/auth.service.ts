import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.password && await bcrypt.compare(password, user.password)) {
      // Não retorne a senha!
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginData: { email: string; password: string }) {
    try {
      if (!loginData?.email || !loginData?.password) {
        throw new UnauthorizedException('Email e senha são obrigatórios');
      }

      const { email, password } = loginData;

      const user = await this.prisma.user.findUnique({ 
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true
        }
      });

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const { password: _, ...userWithoutPassword } = user;
      const payload = { sub: user.id, email: user.email, name: user.name };

      return {
        access_token: this.jwtService.sign(payload),
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Erro no AuthService.login:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao realizar login. \n' + (error.message || ''),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register({ email, password, name }: { email: string; password: string; name: string }) {
    try {
      // Verificar se usuário já existe
      const existingUser = await this.prisma.user.findUnique({ 
        where: { email } 
      });

      if (existingUser) {
        throw new HttpException(
          'Email já está em uso',
          HttpStatus.BAD_REQUEST
        );
      }

      // Criar hash da senha
      const hash = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hash
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      });

      // Gerar token JWT
      const payload = { sub: user.id, email: user.email, name: user.name };
      
      return {
        access_token: this.jwtService.sign(payload),
        user
      };
    } catch (error) {
      console.error('Erro no AuthService.register:', error);
      throw new HttpException(
        error.message || 'Erro ao registrar usuário',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
