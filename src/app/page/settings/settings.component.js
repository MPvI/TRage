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
import { SettingsService } from "../../shared/service/settings.service";
import { DataService } from "../../shared/service/data.service";
var SettingsComponent = (function () {
    function SettingsComponent(settingsService, dataService) {
        this.settingsService = settingsService;
        this.dataService = dataService;
        // Do stuff
    }
    SettingsComponent.prototype.save = function () {
        this.settingsService.save();
        this.dataService.getParameterNames();
    };
    return SettingsComponent;
}());
SettingsComponent = __decorate([
    Component({
        selector: 'my-home',
        templateUrl: 'settings.component.html',
        styleUrls: ['settings.component.scss']
    }),
    __metadata("design:paramtypes", [SettingsService, DataService])
], SettingsComponent);
export { SettingsComponent };
//# sourceMappingURL=settings.component.js.map