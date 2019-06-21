import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MultiWindowService, KnownAppWindow, Message } from 'ngx-multi-window';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'tiimer.net';

  now: Observable<Date>;
  intervalList = [];

  targetSec: number;
  elapsedSec: number;
  remainedSec: number;
  remainedString: string;

  beepCount: number = 1;

  windows: KnownAppWindow[] = [];

  constructor(private multiWindowService: MultiWindowService) {
    multiWindowService.onMessage().subscribe((value: Message) => {
      console.log('Received a message from ' + value.senderId + ': ' + value.data);

      const match = value.data.match(/^setTime (\d+)$/);
      if (match) {
        const newSec: string = match[1];
        this.setNewTime ( '', newSec, false);
      }

      const matchTitle = value.data.match(/^setTitle (.*)$/);
      if (matchTitle) {
        const newTitle: string = matchTitle[1];
        this.setTitle(newTitle, false);
      }

      if (value.data === 'beepOff' ) {
        this.beepOff(false);
      }

    });
  }

  public static beep() {
    // tslint:disable-next-line:max-line-length
    const base64 = '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';
    const sound = new Audio('data:audio/wav;base64,' + base64);
    sound.play();
  }

  public ngOnInit() {
    this.remainedString = '00:00';

    this.multiWindowService.onWindows().subscribe(knownWindows => {
      this.windows = knownWindows;
    });

    this.now = new Observable((observer) => {
      this.intervalList.push(setInterval(() => {
        if ( this.targetSec > 0 && this.remainedSec > 0) {
          this.elapsedSec++;
          this.remainedSec = this.targetSec - this.elapsedSec;
          this.remainedString =
            Math.floor(this.remainedSec / 60).toString().padStart(2, '0') + ':' +
            Math.floor(this.remainedSec % 60).toString().padStart(2, '0');
        }
        if ( this.remainedString === '00:00' && this.beepCount > 0 ) {
          AppComponent.beep();
          this.beepCount--;
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

  setNewTime(min: string, sec: string, isMainWindow: boolean = true) {
    const minNumber = ( parseInt(min, 10) ? parseInt(min, 10) : 0 );
    const secNumber = ( parseInt(sec, 10) ? parseInt(sec, 10) : 0 );
    const newSec = minNumber * 60 + secNumber;
    if ( newSec > 0 && newSec < 60 * 60 ) {
      this.targetSec = newSec + 1;
      this.elapsedSec = 0;
      this.remainedSec = newSec + 1;

      if (isMainWindow === true) {
        this.beepCount = 10;

        const broadcastSec = newSec - 1;
        this.broadcastMessage('setTime ' + broadcastSec.toString());
      }
    }
  }

  windowOpen() {
    window.open('index.html');
  }

  broadcastMessage( message: string ) {
    for ( const window of this.windows ) {
      if (window.id !== this.multiWindowService.id ) {
        this.sendMessage(window.id, message );
      }
    }
  }

  sendMessage(recipientId: string, message: string ) {
    this.multiWindowService.sendMessage(recipientId, 'customEvent', message).subscribe(
      (messageId: string) => {
        console.log('Message send, ID is ' + messageId);
      },
      (error) => {
        console.log('Message sending failed, error: ' + error);
      },
      () => {
        console.log('Message successfully delivered');
      });
  }

  setTitle(title: string, isMainWindow: boolean = true) {
    this.title = title;
    if (isMainWindow === true) {
      this.broadcastMessage('setTitle ' + title);
    }
  }

  beepOff( isMainWindow: boolean = true) {
    this.beepCount = 0;
    if (isMainWindow === true) {
      this.broadcastMessage('beepOff');
    }
  }
}
