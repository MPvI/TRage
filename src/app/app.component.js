var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { routeHelper } from './app.routing';
import { DataService } from "./shared/service/data.service";
import { FavoriteService } from "./shared/service/favorite.service";
import { InfoService } from "./shared/service/info.service";
var AppComponent = (function () {
    function AppComponent(dataService, favoriteService, infoService, el, router) {
        this.dataService = dataService;
        this.favoriteService = favoriteService;
        this.infoService = infoService;
        this.el = el;
        this.router = router;
        this.i = 0;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var hammer = new Hammer(document.body);
        hammer.on("swipeleft", function () {
            _this.i++;
            if (_this.i >= routeHelper.length)
                _this.i = 0;
            _this.router.navigate([routeHelper[_this.i]]);
        });
        hammer.on("swiperight", function () {
            _this.i--;
            if (_this.i < 0)
                _this.i = routeHelper.length - 1;
            _this.router.navigate([routeHelper[_this.i]]);
        });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: 'app.component.html',
        styleUrls: ['app.component.scss'],
    }),
    __metadata("design:paramtypes", [DataService, FavoriteService, InfoService, ElementRef, Router])
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map