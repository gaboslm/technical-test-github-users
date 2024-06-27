import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from 'src/app/pages/user-list/user-list.component';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { GlobalErrorMessageComponent } from './components/global-error-message/global-error-message.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserProfileComponent,
    GlobalErrorMessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
