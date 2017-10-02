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
import { ActivatedRoute } from "@angular/router";
import { DataService } from "../../shared/service/data.service";
import { FavoriteService } from "../../shared/service/favorite.service";
import { InfoService } from "../../shared/service/info.service";
var ListComponent = (function () {
    function ListComponent(dataService, favoriteService, route, infoService) {
        this.dataService = dataService;
        this.favoriteService = favoriteService;
        this.route = route;
        this.infoService = infoService;
        this.showMenu = false;
    }
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getActiveNode().subscribe(function (rsp) {
            var init = _this.displayNode == null;
            _this.displayNode = rsp;
            if (init && _this.displayNode && _this.displayNode.subNodes.length > 0 && _this.displayNode.subNodes[0].name == "Device") {
                _this.dataService.setActiveNode(_this.displayNode.subNodes[0]);
            }
        });
        this.favoriteService.getActiveFav().subscribe(function (rsp) { return _this.activeFav = rsp; });
    };
    ListComponent.prototype.toggle = function (leaf, e) {
        e.stopPropagation();
        if (this.activeFav.has(leaf)) {
            this.activeFav.rem(leaf);
        }
        else {
            this.activeFav.add(leaf);
        }
    };
    ListComponent.prototype.remove = function () {
        if (!this.displayNode.subNodes[0]) {
            this.infoService.setMsg("Nothing to delete here");
            return null;
        }
        var instance = prompt("Instance number:");
        return this.displayNode.fullPath + instance + '.';
    };
    ListComponent.prototype.toggleMenu = function (e) {
        e.stopPropagation();
        this.showMenu = !this.showMenu;
    };
    ListComponent.prototype.smartToggle = function () {
        this.showMenu ? this.showMenu = false : this.dataService.setActiveNode(this.displayNode.parent);
    };
    return ListComponent;
}());
ListComponent = __decorate([
    Component({
        selector: 'my-home',
        templateUrl: 'list.component.html',
        styleUrls: ['list.component.scss']
    }),
    __metadata("design:paramtypes", [DataService, FavoriteService, ActivatedRoute, InfoService])
], ListComponent);
export { ListComponent };
//# sourceMappingURL=list.component.js.map