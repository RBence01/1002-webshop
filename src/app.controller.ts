import { Body, Controller, Get, Param, Post, Query, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  data = [
    {
      id: 1,
      name: 'BobTheBuilder\'s bathwater',
      img: 'https://atlas-content-cdn.pixelsquid.com/stock-images/yellow-metal-paint-can-oJB6ya8-600.jpg'
    },
    {
      id: 2,
      name: 'Sanyi\'s bathwater',
      img: 'https://atlas-content-cdn.pixelsquid.com/stock-images/yellow-metal-paint-can-oJB6ya8-600.jpg'
    },
    {
      id: 3,
      name: 'BeleDelphie\'s bathwater',
      img: 'https://atlas-content-cdn.pixelsquid.com/stock-images/yellow-metal-paint-can-oJB6ya8-600.jpg'
    }
  ]

  @Get()
  @Render('index')
  index(@Query('cart') cart) {
    return {data: this.data, cart: cart};
  }

  @Get('/products/:id')
  @Render('product')
  product(@Param('id') id, @Query('cart') cart = '') {
    const n = parseInt(id);
    if (!n) {
      return {
        error: 'Invalid id'
      }
    }
    const product = this.data.find(item => item.id === n);
    if (!product) {
      return {
        error: 'Product not found'
      }
    }

    return {product, cart: cart};
  }

  @Get('/checkout')
  @Render('checkout')
  checkout(@Query('cart') cart: string) {
    const cartProduct = [];
    new Set(cart.split(',')).forEach(e => {
      const n = parseInt(e);
      if (n) {
        const product = this.data.find(x => x.id === n);
        if (product) cartProduct.push(product);
      }
    });
    return {cart: cartProduct}
  }

  @Post('/checkout')
  purchase(@Res() res: Response, @Body() body) {
    const errors = [];
    if (!body.name || !body.billAddress || !body.address || !body.card || !body.expiry || !body.security) {
      errors.push('Bad input!');
      res.render('/checkout');
      return;
    }
  }
}
