var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "@angular/core";
import { Favorite } from "../class/helper/favorite";
import { BehaviorSubject } from "rxjs";
var FavoriteService = (function () {
    function FavoriteService() {
        this._favorites = new BehaviorSubject([]);
        this._activeFav = new BehaviorSubject(null);
    }
    FavoriteService.prototype.getFavs = function () {
        return this._favorites.asObservable();
    };
    FavoriteService.prototype.getActiveFav = function () {
        return this._activeFav.asObservable();
    };
    FavoriteService.prototype.setActiveFav = function (fav) {
        this._activeFav.next(fav);
    };
    FavoriteService.prototype.add = function (name) {
        if (name && name !== '')
            this._favorites.value.push(new Favorite(name, this));
        this.save();
    };
    FavoriteService.prototype.del = function (fav) {
        var i = this._favorites.value.indexOf(fav);
        if (i !== -1)
            this._favorites.value.splice(i, 1);
        this.save();
        this.setActiveFav(null);
    };
    FavoriteService.prototype.save = function () {
        var favs = [];
        for (var i = 0; i < this._favorites.value.length; i++) {
            favs.push(this._favorites.value[i].saveRep());
        }
        localStorage.setItem("favorites", JSON.stringify(favs));
    };
    FavoriteService.prototype.load = function (dataService) {
        var loaded = JSON.parse(localStorage.getItem("favorites"));
        if (loaded) {
            for (var i = 0; i < loaded.length; i++) {
                var leafArray = [];
                for (var _i = 0, _a = loaded[i].items; _i < _a.length; _i++) {
                    var leafPath = _a[_i];
                    leafArray.push(dataService.findLeaf(leafPath));
                }
                this._favorites.value.push(new Favorite(loaded[i].name, this, leafArray));
            }
            this._activeFav.next(this._favorites.value[0]);
        }
    };
    return FavoriteService;
}());
FavoriteService = __decorate([
    Injectable()
], FavoriteService);
export { FavoriteService };
//# sourceMappingURL=favorite.service.js.map