import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    // In production, validate against database
    // This is a stub - implement actual user lookup
    if (!email || !password) {
      return null;
    }
    return { id: '1', email, role: 'user' };
  }
}
