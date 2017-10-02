import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule, XHRBackend, RequestOptions, Http} from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { ListComponent } from "./page/list/list.component";
import { FavoritesComponent } from "./page/favorites/favorites.component";
import { SettingsComponent } from "./page/settings/settings.component";
import { HomeComponent } from "./page/home/home.component";
import { FavoriteService } from "./shared/service/favorite.service";
import { DataService } from "./shared/service/data.service";
import { SettingsService } from "./shared/service/settings.service";
import { InfoService } from "./shared/service/info.service";
import { ValueComponent } from "./shared/component/value.component";
import { ContainerComponent } from "./shared/component/container.component";

import { httpFactory } from "./shared/class/helper/httpinterceptor";


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    FavoritesComponent,
    SettingsComponent,
    ValueComponent,
    ContainerComponent
  ],
  providers: [
    DataService,
    FavoriteService,
    SettingsService,
    InfoService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

/*
 ,
 {
 provide: Http,
 useFactory: httpFactory,
 deps: [XHRBackend, RequestOptions, SettingsService]
 }
 */
