import { Component, OnDestroy, OnInit } from '@angular/core';
import { RateTableService } from './rate-table.service';
import { CurrencyCode, ExchangeRatePost } from '../datepicker/datepicker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rate-table',
  templateUrl: './rate-table.component.html',
  styleUrls: ['./rate-table.component.scss']
})
export class RateTableComponent implements OnInit, OnDestroy {
  exchangeRatePostsSub: Subscription;
  exchangeRatePosts: ExchangeRatePost[] = [];

  constructor(private rateTableService: RateTableService) { }

  ngOnInit() {
    this.exchangeRatePostsSub = this.rateTableService.exchangeRatePosts
      .subscribe((val: ExchangeRatePost[]) => this.exchangeRatePosts = val);
  }

  sortBySelectedCurrency(currencyCode: CurrencyCode) {
    this.exchangeRatePosts = this.exchangeRatePosts.sort((cur, prev) => {
      const prevRateVal = prev.data.find(i => i.code === currencyCode).value;
      const curRateVal = cur.data.find(i => i.code === currencyCode).value;
      return prevRateVal - curRateVal ;
    });
  }

  ngOnDestroy() {
    this.exchangeRatePostsSub.unsubscribe();
  }
}
