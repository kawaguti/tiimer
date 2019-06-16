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

  targetSec: number;
  elapsedSec: number;
  remainedSec: number;
  remainedString: string;

  constructor() {
  }

  public ngOnInit() {
    this.remainedString = '00:00';
    const newsec = 180;
    if ( newsec > 0 && newsec < 60 * 60 ) {
      this.targetSec = newsec;
      this.elapsedSec = 0;
      this.remainedSec = newsec;
    }
    this.now = new Observable((observer) => {
      this.intervalList.push(setInterval(() => {
        if ( this.targetSec > 0 && this.remainedSec > 0) {
          this.elapsedSec++;
          this.remainedSec = this.targetSec - this.elapsedSec;
          this.remainedString =
            Math.floor(this.remainedSec / 60).toString().padStart(2, '0') + ':' +
            Math.floor(this.remainedSec % 60).toString().padStart(2, '0');
        }
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
