var Pagination = (function () {
    var _default_limit = 1;
    var isArray = Array.isArray || function (arr) {
        return {}.toString.call(arr) == '[object Array]';
    };

    var isInt = function (x) {
        var type = typeof x;
        return type !== null && (type === 'number');
    }

    function _Pagination(list, limit) {
        if (!(this instanceof Pagination)) {
            return new Pagination(list, limit || _default_limit);
        }
        if (!isArray(list)) throw new Error("list must be array");
        this.list = list;
        this.limit = limit;
        this.total = Math.ceil(list.length / limit);
        return this;
    }

    _Pagination.prototype.page = function (pagenum) {
        if (!isInt(pagenum)) throw new Error("pagenum must be number");
        if (pagenum < 1 || pagenum > this.total) {
            throw new Error("pagenum must be in range[" + 1 + ", " + this.total + "]");
        }
        var start = this.limit * (pagenum - 1);
        return this.list.slice(start, start + this.limit);
    };

    _Pagination.prototype.toString = function () {
        var result = [];
        for (var i = 1; i <= this.total; i++) {
            result.push("[" + this.page(i).join(',') + "]");
        }
        return result.join(',');
    }
    _Pagination.prototype.getAll = function () {
        var result = [];
        for (var i = 1; i <= this.total; i++) {
            result.push(this.page(i));
        }
        return result;
    }
    return _Pagination;

})();

var pagination = Pagination([1, 32, 43, 4, 15, 6, 7, 8, 9, 10, 34], 2);
console.log(pagination.getAll())
