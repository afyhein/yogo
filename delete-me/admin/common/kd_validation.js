function kdValidation(props) {
    var self = this;
    self.moment = props.moment;

    /**
     * 必須が設定されてるか
     * @param {any} val
     * @return {boolean}
     */
    self.required = function (val) {
        var error = !val;
        return error;
    };

    /**
     * 文字列最長数を超えてないか
     * @param {string} str
     * @param {number} maxLen
     * @return {boolean}
     */
    self.maxLength = function (str, maxLen) {
        var error = kdUtility.getStrLength(str) > maxLen;
        return error;
    };

    /**
     * 正規表現とマッチするか
     * @param {string} str
     * @param {regexp} regexp
     * @return {boolean}
     */
    self.regexMatch = function (str, regexp) {
        var error = !str.match(regexp);
        return error;
    };

    /**
     * 値が同一か
     * @param {any} val1
     * @param {any} val2
     * @return {boolean}
     */
    self.same = function (val1, val2) {
        var error = !(val1 == val2);
        return error;
    };

    /**
     * 値が同一ではないか
     * @param {any} val1
     * @param {any} val2
     * @return {boolean}
     */
    self.notSame = function (val1, val2) {
        var error = !self.same(val1, val2);
        return error;
    };

    /**
     * 期間が正しいか
     * @param {string} start - 開始日
     * @param {string} end - 終了日
     * @return {boolean}
     */
    self.validPriod = function (start, end) {
        start = start.replace(/\./g, '/');
        start = self.moment(start);

        end = end.replace(/\./g, '/');
        end = self.moment(end);

        var error = end.diff(start) < 0;
        return error;
    };

    /**
     * コードが正しいか
     * @param {number|string} code
     * @param {number|string} codeArgs
     * @return {boolean}
     */
    self.validCode = function (code, ...codeArgs) {
        var error = !(code in codeArgs);
        return error;
    };
}
