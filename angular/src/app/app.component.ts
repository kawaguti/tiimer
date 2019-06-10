import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MultiWindowService, Message, KnownAppWindow } from 'ngx-multi-window';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private multiWindowService: MultiWindowService) {
  }
  now: Observable<Date>;
  intervalList = [];
  targetSec: number;
  elapsedSec: number;
  remainedSec: number;
  remainedString: string;
  beepFlag: boolean;

  ownName: string;
  ownId: string;

  windows: KnownAppWindow[] = [];
  logs: string[] = [];

  newName: string;

  public static beep() {
    // tslint:disable-next-line:max-line-length
    const base64 = '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';
    const sound = new Audio('data:audio/wav;base64,' + base64);
    sound.play();
  }

  @HostListener('window:unload')
  unloadHandler() {
    this.multiWindowService.saveWindow();
  }

  public ngOnInit() {

    this.ownId = this.multiWindowService.id;
    this.ownName = this.multiWindowService.name;
    if (this.ownName.indexOf(this.ownId) >= 0) {
      this.multiWindowService.name = this.ownName = (new Date()).toTimeString();
    }
    this.newName = this.ownName;
    this.windows = this.multiWindowService.getKnownWindows();

    this.remainedString = '00:00';

    this.multiWindowService.onMessage().subscribe((value: Message) => {
      // tslint:disable-next-line:radix
      const newsec = parseInt(value.data);
      if ( newsec > 0 && newsec < 60 * 60 ) {
        this.targetSec = newsec;
        this.elapsedSec = 0;
        this.remainedSec = newsec;
      }
      if ( value.data === 'beepOff' ) { this.beepFlag = false; }
      this.logs.unshift('Received a message from ' + value.senderId + ': ' + value.data);
    });

    this.multiWindowService.onWindows().subscribe(knownWindows => this.windows = knownWindows);

    this.now = new Observable((observer) => {
      this.intervalList.push(setInterval(() => {
        if ( this.targetSec > 0 && this.remainedSec > 0) {
          this.elapsedSec++;
          this.remainedSec = this.targetSec - this.elapsedSec;
          this.remainedString =
            Math.floor(this.remainedSec / 60).toString().padStart(2, '0') + ':' +
            Math.floor(this.remainedSec % 60).toString().padStart(2, '0');
        }
        if ( this.remainedString === '00:00' && this.beepFlag ) { AppComponent.beep(); }

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


  public broadcastTime( min: string, sec: string ) {
    // tslint:disable-next-line:radix
    const minNumber = ( parseInt(min) ? parseInt(min) : 0 );
    // tslint:disable-next-line:radix
    const secNumber = ( parseInt(sec) ? parseInt(sec) : 0 );
    const newsec = minNumber * 60 + secNumber + 1;
    this.broadcastMessage(newsec.toString());

    if ( newsec > 0 && newsec < 60 * 60 ) {
      this.targetSec = newsec;
      this.elapsedSec = 0;
      this.remainedSec = newsec;
    }
  }

  public broadcastMessage( message: string ) {
    this.windows.forEach((window) => {
      this.sendMessage(window.id, message);
    });
  }


  public sendMessage(recipientId: string, message: string) {
    if (recipientId === this.ownId) {
      // Catch sending messages to itself. Trying to do so throws an error from multiWindowService.sendMessage()
      this.logs.unshift('Can\'t send messages to itself. Select another window.');

      return;
    }

    this.multiWindowService.sendMessage(recipientId, 'customEvent', message).subscribe(
      (messageId: string) => {
        this.logs.unshift('Message send, ID is ' + messageId);
      },
      (error) => {
        this.logs.unshift('Message sending failed, error: ' + error);
      },
      () => {
        this.logs.unshift('Message successfully delivered');
      });
  }

  public removeLogMessage(index: number) {
    this.logs.splice(index, 1);
  }

  public changeName() {
    this.multiWindowService.name = this.ownName = this.newName;
  }

  public newWindow() {
    const newWindowData = this.multiWindowService.newWindow();
    newWindowData.created.subscribe(() => {
      },
      (err) => {
        this.logs.unshift('An error occured while waiting for the new window to start consuming messages');
      },
      () => {
        this.logs.unshift('The new window with id ' + newWindowData.windowId + ' got created and starts consuming messages');
      }
    );
    window.open('?' + newWindowData.urlString);
  }

}


