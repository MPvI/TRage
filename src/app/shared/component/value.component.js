var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from "@angular/core";
import { TreeLeaf } from "../class/tree/tree-leaf";
var ValueComponent = (function () {
    function ValueComponent() {
        this.showFullName = false;
    }
    ValueComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.leaf.value.subscribe(function (val) {
            _this.currVal = val;
            _this.initVal = val;
            if (_this.leaf.type == 'xsd:boolean') {
                _this.boolVal = _this.initVal == 1;
            }
        });
    };
    ValueComponent.prototype.sendBool = function (e) {
        var _this = this;
        e.stopPropagation();
        this.leaf.send(!this.boolVal);
        setTimeout(function () { return _this.leaf.query(); }, 135);
    };
    return ValueComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", TreeLeaf)
], ValueComponent.prototype, "leaf", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ValueComponent.prototype, "showFullName", void 0);
ValueComponent = __decorate([
    Component({
        selector: 'my-value',
        templateUrl: 'value.component.html',
        styleUrls: ['value.component.scss']
    }),
    __metadata("design:paramtypes", [])
], ValueComponent);
export { ValueComponent };
//# sourceMappingURL=value.component.js.map