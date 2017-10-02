var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
var InfoService = (function () {
    function InfoService() {
        this.warnMsg = '';
        this._showWarn = new BehaviorSubject(false);
        this.showWarn = false;
    }
    InfoService.prototype.getMsgState = function () {
        return this._showWarn.asObservable();
    };
    InfoService.prototype.setMsg = function (msg) {
        var _this = this;
        this.warnMsg = msg;
        this._showWarn.next(true);
        setTimeout(function () { return _this._showWarn.next(false); }, 2000);
    };
    return InfoService;
}());
InfoService = __decorate([
    Injectable()
], InfoService);
export { InfoService };
//# sourceMappingURL=info.service.js.map