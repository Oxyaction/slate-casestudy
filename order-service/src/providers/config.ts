import { Injectable } from '@nestjs/common';
const config = require('config');

@Injectable()
export class Config {
  get(key: string) {
    return config.get(key);
  }
}