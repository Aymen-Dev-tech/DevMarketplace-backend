import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { Public } from './common/skip-auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('/webhook')
  async webhook(
    @Body() checkout: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log('processing the payment');
    res.setHeader('Content-Type', 'application/json');
    const signature = req.header('signature');
    if (!signature) {
      console.log('no signature included');
      return res.sendStatus(400);
    }
    // Calculate the signature
    const computedSignature = crypto
      .createHmac('sha256', process.env.SECRET_KEY)
      .update(JSON.stringify(checkout))
      .digest('hex');

    // If the calculated signature doesn't match the received signature, ignore the request
    if (computedSignature !== signature) {
      console.log('signature does not match');
      return res.sendStatus(403);
    }
    switch (checkout.type) {
      case 'checkout.paid':
        console.log('processing with checkout items retrieveing ');
        //retrieve the checkout id and use it to access all purchased items
        const options = {
          method: 'GET',
          headers: { Authorization: `Bearer ${process.env.SECRET_KEY}` },
        };
        try {
          console.log('checkout ID', checkout.data.id);
          const response = await fetch(
            `https://pay.chargily.net/test/api/v2/checkouts/${checkout.data.id}/items`,
            options,
          );
          if (!response.ok) {
            throw new Error('error while retrieveing checkout items');
          }
          const json = await response.json();
          console.log('retrieve checkout items: ', json);
          console.log('checkout items: ', json.data);
        } catch (error) {
          console.error(error.message);
        }

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
