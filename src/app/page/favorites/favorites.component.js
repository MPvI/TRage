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
import { FavoriteService } from "../../shared/service/favorite.service";
var FavoritesComponent = (function () {
    function FavoritesComponent(favoriteService) {
        this.favoriteService = favoriteService;
        //NOOP
    }
    FavoritesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.favoriteService.getActiveFav().subscribe(function (rsp) { return _this.displayFavorite = rsp; });
        this.favoriteService.getFavs().subscribe(function (rsp) { return _this.favoriteList = rsp; });
    };
    FavoritesComponent.prototype.newFav = function () {
        var name = prompt("Provide name for new favorite:", "myFav");
        this.favoriteService.add(name);
    };
    FavoritesComponent.prototype.delFav = function () {
        if (!this.displayFavorite)
            return;
        var sel = confirm("Really delete " + this.displayFavorite.name + " ?");
        if (sel) {
            this.favoriteService.del(this.displayFavorite);
        }
    };
    FavoritesComponent.prototype.toggle = function (leaf, e) {
        e.stopPropagation();
        if (this.displayFavorite.has(leaf)) {
            this.displayFavorite.rem(leaf);
        }
        else {
            this.displayFavorite.add(leaf);
        }
    };
    return FavoritesComponent;
}());
FavoritesComponent = __decorate([
    Component({
        selector: 'my-home',
        templateUrl: 'favorites.component.html',
        styleUrls: ['favorites.component.scss']
    }),
    __metadata("design:paramtypes", [FavoriteService])
], FavoritesComponent);
export { FavoritesComponent };
//# sourceMappingURL=favorites.component.js.map