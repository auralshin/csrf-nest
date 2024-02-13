// csrf.middleware.ts
import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Tokens from 'csrf';
import cookieParser from 'cookie-parser';
import { CsrfModule } from './csrf.module';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private tokens = new Tokens();

  use(req: Request, res: Response, next: NextFunction) {
    // Use cookie-parser to parse the cookies
    cookieParser()(req, res, (err) => {
      if (err) throw err;

      // Get the CSRF secret from the cookies or generate a new one if it doesn't exist
      let secret = req.cookies['csrf-secret'];
      console.log(secret);
      if (!secret) {
        secret = this.tokens.secretSync();
        res.cookie('csrf-secret', secret, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      }
      console.log(req.cookies['csrf-secret']);
      const options = CsrfModule.getOptions();
      const tokenGenerationUrl =
        options.tokenGenerationUrl || '/api/csrf-token';
      // If it's a GET request or the csrf-token route, generate a new CSRF token
      if (req.method === 'GET' && req.url === tokenGenerationUrl) {
        const token = this.tokens.create(secret);
        res.cookie('XSRF-TOKEN', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });

        if (req.url === tokenGenerationUrl) {
          res.locals.csrfToken = token;
          req.cookies['XSRF-TOKEN'] = token;
        }
      }
      // For POST, DELETE, PATCH, and OPTIONS requests, verify the CSRF token
      else if (['POST', 'DELETE', 'PATCH', 'OPTIONS'].includes(req.method)) {
        const tokenFromRequest = req.cookies['XSRF-TOKEN'] as string;
        if (
          !tokenFromRequest ||
          !this.tokens.verify(secret, tokenFromRequest)
        ) {
          // If the CSRF token is missing or invalid, return a 403 Forbidden response
          throw new ForbiddenException('Invalid CSRF Token');
        }
        const newToken = this.tokens.create(secret);
        res.cookie('XSRF-TOKEN', newToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true, // uncomment this line in production environment
        });
      }
      next();
    });
  }
}
