var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { DataService } from "../../shared/service/data.service";
var HomeComponent = (function () {
    function HomeComponent(dataService) {
        this.dataService = dataService;
        this.showInfo = false;
        // Do stuff
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent.prototype.toggleInfo = function () {
        this.showInfo = !this.showInfo;
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    Component({
        selector: 'my-home',
        templateUrl: 'home.component.html',
        styleUrls: ['home.component.scss']
    }),
    __metadata("design:paramtypes", [DataService])
], HomeComponent);
export { HomeComponent };
//# sourceMappingURL=home.component.js.map