var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
var SettingsService = (function () {
    function SettingsService() {
        /*
        fritz.box:49443
        speedport.ip:37443
         */
        this.settings = [
            {
                id: "default",
                usr: "dslf-config",
                pwd: "55489786",
                srv: "speedport.ip",
                scp: 37443
            }
        ];
        this.load();
    }
    SettingsService.prototype.getTargetUrl = function () {
        //
        return 'https://' + this.settings[0].usr + ':' + this.settings[0].pwd + '@' + this.settings[0].srv + ':' + this.settings[0].scp;
    };
    SettingsService.prototype.save = function () {
        localStorage.setItem("settings", JSON.stringify(this.settings));
    };
    SettingsService.prototype.load = function () {
        var loaded = JSON.parse(localStorage.getItem("settings"));
        if (loaded)
            this.settings = loaded;
    };
    return SettingsService;
}());
SettingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SettingsService);
export { SettingsService };
//# sourceMappingURL=settings.service.js.map