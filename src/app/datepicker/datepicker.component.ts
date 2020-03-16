import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DatepickerService} from './datepicker.service';

const MAX_DAYS_INTERVAL = 5;

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit, OnDestroy {
  dateFromCtrl: FormControl = new FormControl('');
  dateToCtrl: FormControl = new FormControl('');
  dateFrom: Date;
  dateTo: Date;
  subscriptions: Subscription[] = [];

  constructor(private datepickerService: DatepickerService) { }

  ngOnInit() {
    this.subscriptions = [
      this.dateFromCtrl.valueChanges.subscribe((val: Date) => this.dateFrom = val),
      this.dateToCtrl.valueChanges.subscribe((val: Date) => this.dateTo = val)
    ];
  }

  onFetchRates() {
    if (!this.dateFrom || !this.dateTo) {
      this.datepickerService.showError('Поле "Дата" не может быть пустым');
      return;
    }
    if (this.dateTo.getTime() - this.dateFrom.getTime() < 0 || (new Date()).getTime() < this.dateTo.getTime()) {
      this.datepickerService.showError('Неверный формат даты');
      return;
    }
    if (this.dateTo.getTime() - this.dateFrom.getTime() >= this.datepickerService.getMsInDays(MAX_DAYS_INTERVAL)) {
      this.datepickerService.showError('Период "с - до" не должен превышать 5 дней.');
      return;
    }
    this.datepickerService.fetchRates(this.dateFrom, this.dateTo);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
