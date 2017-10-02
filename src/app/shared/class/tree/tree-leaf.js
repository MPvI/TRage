import { BehaviorSubject } from "rxjs";
var TreeLeaf = (function () {
    function TreeLeaf(obj, name, parent, dataService) {
        this.dataService = dataService;
        this._parent = null;
        this.status = 0;
        this._parent = parent;
        this._name = name;
        this._location = parent.fullPath;
        this._writable = obj == '1';
        this._value = new BehaviorSubject("");
    }
    Object.defineProperty(TreeLeaf.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeLeaf.prototype, "writable", {
        get: function () {
            return this._writable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeLeaf.prototype, "fullPath", {
        get: function () {
            return this._location + this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeLeaf.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeLeaf.prototype, "value", {
        get: function () {
            return this._value.asObservable();
        },
        set: function (v) {
            this._value.next(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeLeaf.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (t) {
            this._type = t;
        },
        enumerable: true,
        configurable: true
    });
    TreeLeaf.prototype.query = function () {
        this.status = 1;
        this.dataService.getValues([this]);
    };
    TreeLeaf.prototype.send = function (v) {
        this.status = 1;
        this.dataService.setValues([this], [v]);
    };
    return TreeLeaf;
}());
export { TreeLeaf };
//# sourceMappingURL=tree-leaf.js.map