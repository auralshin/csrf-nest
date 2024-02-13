# NestJS CSRF Protection Package

This package provides a robust CSRF (Cross-Site Request Forgery) protection mechanism for NestJS applications, leveraging dynamic module registration for flexible configuration.

## Features

- Easy integration with NestJS projects.
- Customizable token generation and validation routes.
- Secure token handling using cookies.

## Installation

```bash
npm install csrf-nest
```

## Usage

1. **Module Import**: Import `CsrfModule` into your application module:

```typescript
import { CsrfModule } from 'csrf-nest';

@Module({
  imports: [
    CsrfModule.forRoot({
      tokenGenerationUrl: '/api/csrf-token', // optional custom path
    }),
  ],
})
export class AppModule {}
```

2. **Service Injection** (optional): If you need direct access to CSRF functionality:

```typescript
import { CsrfService } from 'csrf-nest';

@Injectable()
export class YourService {
  constructor(private readonly csrfService: CsrfService) {}
}
```

## Configuration

Describe any configuration options your package offers, such as custom token generation paths or token expiration settings.

## Contributing

Encourage contributions by providing guidelines for submitting issues, feature requests, and pull requests.

## License

