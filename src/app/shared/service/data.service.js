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
import { Http, Headers, RequestOptions } from "@angular/http";
import { Router } from "@angular/router";
import { SettingsService } from "./settings.service";
import { InfoService } from "./info.service";
import { FavoriteService } from "./favorite.service";
import { Soap } from "../class/helper/soap";
import { TreeNode } from "../class/tree/tree-node";
import { BehaviorSubject } from "rxjs";
var DataService = (function () {
    function DataService(http, settingsService, infoService, favoriteService, router) {
        this.http = http;
        this.settingsService = settingsService;
        this.infoService = infoService;
        this.favoriteService = favoriteService;
        this.router = router;
        this._loaded = false;
        this._activeNode = new BehaviorSubject(this._rootNode);
        this.init();
        Soap.init(this.infoService);
    }
    DataService.prototype.init = function () {
        if (!this._loaded) {
            this.getParameterNames();
        }
    };
    DataService.prototype.getParameterNames = function (node) {
        var _this = this;
        var headers = new Headers();
        headers.append("SoapAction", "GetParameterNames");
        var options = new RequestOptions({
            headers: headers
        });
        // Get Full List
        this.http.post(this.settingsService.getTargetUrl(), Soap.getListMessage(), options).subscribe(function (rsp) {
            _this._rootNode = new TreeNode(Soap.generateTreeFromList(rsp.text()), '', null, _this);
            if (node) {
                _this._activeNode.next(_this.findNode(node.fullPath));
            }
            else {
                _this._activeNode.next(_this._rootNode);
            }
            _this._loaded = true;
            _this.favoriteService.load(_this);
        });
    };
    Object.defineProperty(DataService.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    DataService.prototype.getActiveNode = function () {
        return this._activeNode.asObservable();
    };
    DataService.prototype.setActiveNode = function (value) {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        if (value)
            this._activeNode.next(value);
    };
    DataService.prototype.getValues = function (leafs) {
        var headers = new Headers();
        headers.append("SoapAction", "GetParamaterValues");
        var options = new RequestOptions({
            headers: headers
        });
        this.http
            .post(this.settingsService.getTargetUrl(), Soap.getValuesMessage(leafs), options)
            .subscribe(function (rsp) { return Soap.getValuesCallback(rsp.text(), leafs); });
        //TODO Error handling
    };
    DataService.prototype.setValues = function (leafs, values) {
        var headers = new Headers();
        headers.append("SoapAction", "SetParameterValues");
        var options = new RequestOptions({
            headers: headers
        });
        this.http
            .post(this.settingsService.getTargetUrl(), Soap.setValuesMessage(leafs, values), options)
            .subscribe(function (rsp) { return console.log(rsp); });
        //TODO Response Handling
    };
    DataService.prototype.addObject = function (obj, node) {
        var _this = this;
        var headers = new Headers();
        headers.append("SoapAction", "AddObject");
        var options = new RequestOptions({
            headers: headers
        });
        this.http
            .post(this.settingsService.getTargetUrl(), Soap.addObjectMessage(obj), options)
            .subscribe(function (rsp) { console.log(rsp); _this.getParameterNames(node); });
        //TODO Response Handling
    };
    DataService.prototype.delObject = function (obj, node) {
        var _this = this;
        var headers = new Headers();
        headers.append("SoapAction", "DeleteObject");
        var options = new RequestOptions({
            headers: headers
        });
        this.http
            .post(this.settingsService.getTargetUrl(), Soap.delObjectMessage(obj), options)
            .subscribe(function (rsp) { console.log(rsp); _this.getParameterNames(node); });
        //TODO Response Handling
    };
    DataService.prototype.reboot = function () {
        var conf = confirm("Reboot now?");
        if (!conf)
            return;
        var headers = new Headers();
        headers.append("SoapAction", "Reboot");
        var options = new RequestOptions({
            headers: headers
        });
        this.http
            .post(this.settingsService.getTargetUrl(), Soap.rebootMessage(), options)
            .subscribe(function (rsp) { return console.log(rsp); });
        //TODO Response Handling
    };
    DataService.prototype.reset = function () {
        var conf = confirm("Reset now?");
        if (!conf)
            return;
        var headers = new Headers();
        headers.append("SoapAction", "FactoryReset");
        var options = new RequestOptions({
            headers: headers
        });
        this.http
            .post(this.settingsService.getTargetUrl(), Soap.factoryResetMessage(), options)
            .subscribe(function (rsp) { return console.log(rsp); });
        //TODO Response Handling
    };
    DataService.prototype.jumptonode = function (node) {
        this.router.navigate(["/list"]);
        return this.setActiveNode(node);
    };
    DataService.prototype.search = function (path) {
        var node = this.findNode(path);
        if (node) {
            return this.jumptonode(node);
        }
        else {
            var leaf = this.findLeaf(path);
            if (leaf) {
                return this.jumptonode(leaf.parent);
            }
            else {
                var modnode = this.findNode(path + '.');
                if (modnode) {
                    return this.jumptonode(modnode);
                }
            }
        }
        this.infoService.setMsg("Not found.");
    };
    DataService.prototype.findLeaf = function (path) {
        return this._rootNode.find(path.trim().split('.'));
    };
    DataService.prototype.findNode = function (path) {
        return this._rootNode.findNode(path.trim().split('.'));
    };
    return DataService;
}());
DataService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http, SettingsService, InfoService, FavoriteService, Router])
], DataService);
export { DataService };
//# sourceMappingURL=data.service.js.map