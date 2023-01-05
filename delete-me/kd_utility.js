var kdUtility = new (function () {
    /**
     * サロゲートペアを１文字として扱った文字数を返す
     * @param {string} str
     */
    this.getStrLength = function (str) {
        str = str === undefined || str === null ? '' : str;
        var strAry = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
        return strAry.length;
    };
})();
