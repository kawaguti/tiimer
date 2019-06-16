import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'single-window';

  now: Observable<Date>;
  intervalList = [];

  constructor() {
  }

  public ngOnInit() {
    this.now = new Observable((observer) => {
      this.intervalList.push(setInterval(() => {
        observer.next(new Date());
      }, 1000));
    });
  }

  ngOnDestroy() {
    if (this.intervalList) {
      this.intervalList.forEach((interval) => {
        clearInterval(interval);
      });
    }
  }
}
