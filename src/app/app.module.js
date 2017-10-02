var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
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
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
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
            ValueComponent
        ],
        providers: [
            DataService,
            FavoriteService,
            SettingsService,
            InfoService
        ],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map