import { Controller, Post } from '@nestjs/common';
import { DemoService } from './demo.service.js';

@Controller('demo')
export class DemoController {
  constructor(private readonly demo: DemoService) {}
  @Post('reset')
  reset() {
    return this.demo.reset();
  }
}
