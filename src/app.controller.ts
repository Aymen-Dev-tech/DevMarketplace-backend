import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/webhook')
  webhook(@Body() checkout: any, @Req() req: Request, @Res() res: Response) {
    const signature = req.header('signature');
    if (!signature) {
      return res.status(400).send({ error: 'HTTP signature is required ' });
    }
    // Calculate the signature
    const computedSignature = crypto
      .createHmac('sha256', process.env.SECRET_KEY)
      .update(JSON.stringify(checkout))
      .digest('hex');

    // If the calculated signature doesn't match the received signature, ignore the request
    if (computedSignature !== signature) {
      return res.sendStatus(403);
    }
    switch (checkout.type) {
      case 'checkout.paid':
        console.log({ checkout: checkout.data });
        // Handle the successful payment.
        break;
      case 'checkout.failed':
        return res.sendStatus(403);
        // Handle the failed payment.
        break;
    }
    // Respond with a 200 OK status code to let us know that you've received the webhook
    res.sendStatus(200);
  }
}
