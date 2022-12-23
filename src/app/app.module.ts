import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { ConfigModule, SearchConfig, NgxSpinnerConfig } from './config-module/config.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { DetailsComponent } from './details/details.component';
import { MenuComponent } from './menu/menu.component';
import { ListComponent } from './list/list.component';

import { FilterPipe } from './common/filters/filter.pipe';

const searchConfig: SearchConfig = {
  storedSearches: 3,
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    DetailsComponent,
    MenuComponent,
    ListComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ConfigModule.forRoot(searchConfig),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
