var Favorite = (function () {
    function Favorite(name, favSvc, leafs) {
        this.favSvc = favSvc;
        this._name = name;
        if (leafs)
            this._myLeafs = leafs;
        else
            this._myLeafs = [];
    }
    Favorite.prototype.add = function (leaf) {
        this._myLeafs.push(leaf);
        this.favSvc.save();
    };
    Favorite.prototype.rem = function (leaf) {
        var i = this._myLeafs.indexOf(leaf);
        if (i !== -1)
            this._myLeafs.splice(i, 1);
    };
    Favorite.prototype.has = function (leaf) {
        return this._myLeafs.indexOf(leaf) != -1;
    };
    Object.defineProperty(Favorite.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Favorite.prototype, "myLeafs", {
        get: function () {
            return this._myLeafs;
        },
        enumerable: true,
        configurable: true
    });
    Favorite.prototype.saveRep = function () {
        var favString = [];
        for (var i = 0; i < this._myLeafs.length; i++) {
            favString.push(this._myLeafs[i].fullPath);
        }
        return {
            name: this._name,
            items: favString,
        };
    };
    return Favorite;
}());
export { Favorite };
//# sourceMappingURL=favorite.js.map