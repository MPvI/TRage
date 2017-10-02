import { TreeLeaf } from "./tree-leaf";
var TreeNode = (function () {
    function TreeNode(tree, name, parent, dataService) {
        this.dataService = dataService;
        this._parent = null;
        this._parent = parent;
        this._name = name;
        this._location = parent ? parent.fullPath : '';
        this._subNodes = [];
        this._subLeafs = [];
        if (typeof tree !== 'object')
            return;
        for (var _i = 0, _a = Object.keys(tree); _i < _a.length; _i++) {
            var key = _a[_i];
            if (typeof tree[key] == 'object') {
                this._subNodes.push(new TreeNode(tree[key], key, this, dataService));
            }
            else {
                this._subLeafs.push(new TreeLeaf(tree[key], key, this, dataService));
            }
        }
    }
    Object.defineProperty(TreeNode.prototype, "fullPath", {
        get: function () {
            return this._location + this._name + (this._name !== '' ? '.' : '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "subNodes", {
        get: function () {
            return this._subNodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "subLeafs", {
        get: function () {
            return this._subLeafs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    TreeNode.prototype.query = function () {
        this.dataService.getValues(this._subLeafs);
    };
    TreeNode.prototype.find = function (p) {
        for (var _i = 0, _a = this._subNodes; _i < _a.length; _i++) {
            var subNode = _a[_i];
            if (subNode.name === p[0]) {
                return subNode.find(p.slice(1));
            }
        }
        for (var _b = 0, _c = this._subLeafs; _b < _c.length; _b++) {
            var subLeaf = _c[_b];
            if (subLeaf.name === p[0]) {
                return subLeaf;
            }
        }
        return null;
    };
    TreeNode.prototype.findNode = function (p) {
        if (p[0] == "") {
            return this;
        }
        for (var _i = 0, _a = this._subNodes; _i < _a.length; _i++) {
            var subNode = _a[_i];
            if (subNode.name === p[0]) {
                return subNode.findNode(p.slice(1));
            }
        }
        return null;
    };
    return TreeNode;
}());
export { TreeNode };
//# sourceMappingURL=tree-node.js.map