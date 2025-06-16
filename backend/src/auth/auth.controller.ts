import { Body, Controller, Get, UseGuards, Post, Res, UnauthorizedException, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.validateLogin(dto.email, dto.password);
    console.log("Login result:", result);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    res.cookie('jwt', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { user: result.user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return { user: req['user'] };
  }
}