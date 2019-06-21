import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MultiWindowModule} from 'ngx-multi-window';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MultiWindowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
