import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    const result = await this.authService.validateLogin(dto.email, dto.password);
    if (!result) {
      throw new UnauthorizedException('Email or password invalid');
    }
    return result;
  }
}