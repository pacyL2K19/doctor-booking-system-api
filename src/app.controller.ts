import { Controller, Get, Header, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('service-worker.js')
  @Header('Content-Type', 'application/javascript')
  getServiceWorker(@Res() res: Response): void {
    // Return an empty service worker file
    res.send('// Empty service worker');
  }
}
