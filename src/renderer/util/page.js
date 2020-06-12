
export const Pagination = (function () {
    let _default_limit = 1;
    let isArray = Array.isArray || function (arr) {
        return {}.toString.call(arr) == '[object Array]';
    };

    let isInt = function (x) {
        let type = typeof x;
        return type !== null && (type === 'number');
    };

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
        let start = this.limit * (pagenum - 1);
        return this.list.slice(start, start + this.limit);
    };

    _Pagination.prototype.toString = function () {
        let result = [];
        for (let i = 1; i <= this.total; i++) {
            result.push("[" + this.page(i).join(',') + "]");
        }
        return result.join(',');
    };

    _Pagination.prototype.getAll = function () {
        let result = [];
        for (let i = 1; i <= this.total; i++) {
            result.push(this.page(i));
        }
        return result;
    };
    return _Pagination;

})();
