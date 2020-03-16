import { Injectable } from '@angular/core';
import {ExchangeRatePost} from '../datepicker/datepicker.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateTableService {
  exchangeRatePosts = new Subject<ExchangeRatePost[]>();

  constructor() { }

  updateRatePosts(value: ExchangeRatePost[]) {
    this.exchangeRatePosts.next(value);
  }
}
