import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { RateTableService } from '../rate-table/rate-table.service';
import { HttpClient } from '@angular/common/http';
import { concatMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

interface CurrenctRespInfo {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export enum CurrencyCode {
  Usd = 'USD',
  Eur = 'EUR',
  Gbp = 'GBP'
}

export interface CurrencyInfo {
  code: CurrencyCode;
  value: number;
}

export interface ExchangeRatePost {
  date: string;
  data: CurrencyInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private rateTableService: RateTableService
  ) { }

  showError(message: string, action: string = 'Cancel') {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  fetchRates(from, to) {
    const exchangeRatePosts: ExchangeRatePost[] = [];
    const selectedFormatedDates: string[] = this.getSelectedFormatedDates(from, to);

    selectedFormatedDates.forEach((formatedDate: string) => {
      this.http.get<CurrenctRespInfo[]>(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&date=${formatedDate}`)
        .pipe(
          concatMap((data: CurrenctRespInfo[]) => of (data)),
          take(1),
        )
        .subscribe((data: CurrenctRespInfo[]) => {
          const filteredRespCurrencies: CurrenctRespInfo[] = data
            .filter(currency => currency.cc === CurrencyCode.Usd
              || currency.cc === CurrencyCode.Eur
              || currency.cc === CurrencyCode.Gbp);

          const currenciesListInfo: CurrencyInfo[] = filteredRespCurrencies
            .map(currency => ({code: (currency.cc as CurrencyCode), value: currency.rate}));

          exchangeRatePosts.push({
            date: filteredRespCurrencies[0].exchangedate,
            data: currenciesListInfo
          });

          this.rateTableService.updateRatePosts(exchangeRatePosts);
        }, error => this.showError('Что-то пошло не так :('));
    });
  }

  getMsInDays(amountOfDays: number): number {
    return 1000 * 60 * 60 * 24 * amountOfDays;
  }

  getSelectedFormatedDates(from: Date, to: Date): string[] {
    const dates: string[] = [];
    const maxDateInMs = to.getTime();
    let currentDateInMs = from.getTime();
    while (maxDateInMs >= currentDateInMs) {
      dates.push(this.getReqFormatedDate(new Date(currentDateInMs)));
      currentDateInMs += this.getMsInDays(1);
    }
    return dates;
  }

  getReqFormatedDate(date: Date): string {
    const dd: string = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
    const mm: string = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString();
    const yyyy: string = (date.getFullYear()).toString();
    return yyyy + mm + dd;
  }
}
