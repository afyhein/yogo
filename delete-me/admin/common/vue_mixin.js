/**
 * vue.js のミックスイン
 */
var vueMixin = {
    filters: {
        /**
         * 日付フォーマット（年月日）
         * @param {date} date
         * @return {string}
         */
        YYYYMMDD: function (date) {
            if (!date) {
                return '';
            }

            date = date.replace(/\./g, '/');
            return moment(date).format('YYYY.MM.DD');
        },
        /**
         * 日付フォーマット（年月日 時分）
         * @param {date} date
         * @return {string}
         */
        YYYYMMDD_HHMM: function (date) {
            if (!date) {
                return '';
            }

            date = date.replace(/\./g, '/');
            return moment(date).format('YYYY.MM.DD HH:mm');
        }
    },
    methods: {
        /**
         * HTMLをエスケープする
         * @param {string} html
         * @return {string}
         */
        escapeHTML(html) {
            return html
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },
        /**
         * 時間をフォーマットする
         * @param {string} date
         * @param {string} format (option)
         * @return {string}
         */
        formatDate(date, format) {
            if (!date) {
                return '';
            }

            date = date.replace(/\./g, '/');
            format = format === undefined ? 'YYYY.MM.DD HH:mm' : format;
            return moment(date).format(format);
        },
        /**
         * 時間(utc)を日本時間に変換する
         * @param {string} date
         * @return {string}
         */
        jpDate(date) {
            date = date.replace(/\./g, '/');
            return moment(date).add(9, 'h');
        },
        /**
         * 時間の形式が正しいかを判定する
         * @param {string} date
         * @return {boolean}
         */
        isValidDate(date) {
            return moment(date).isValid();
        },
        /**
         * 秒を含むフル日付のみフォーマットする
         * @param {string} date
         * @param {string} format (option)
         * @return {string}
         */
        fmtFullDateOnly(date, format) {
            var dateRegExp = new RegExp(
                /^[0-9]{4}(\.|-)(0[1-9]|1[0-2])(\.|-)(0[1-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
            );
            var isFullDateFmt = !!date.match(dateRegExp);
            return isFullDateFmt ? this.formatDate(date, format) : date;
        },
        /**
         * ステータスからCSSのクラスを生成する
         * @param {string} type
         * @param {string} status
         * @return {string}
         */
        convertStatusClass(type, status) {
            switch (status) {
                case CONST_FILTER_STATUS_DRAFT:
                    return type + '-status-0';
                case CONST_FILTER_STATUS_PUBLIC:
                    return type + '-status-1';
                case CONST_FILTER_STATUS_PUBLIC_RESERVE:
                    return type + '-status-2';
                case CONST_FILTER_STATUS_PUBLIC_END:
                    return type + '-status-3';
            }
        },
        /**
         * S3の画像URLを作成する
         * @param {string} path
         * @param {number} size
         * @return {string}
         */
        createS3ImgUrl(path, size) {
            if (!path) {
                return '';
            }
            size = size === undefined ? 160 : size;
            return this.BASE_IMG_URL + path + '?s=' + size;
        },
        /**
         * 絶対パスを作成する
         * @param {string} path
         * @return {string}
         */
        siteUrl(path) {
            path = path.replace(/^\//, '');
            return location.origin + '/' + path;
        },
        /**
         * 新しいウィンドウを開く
         * @param {string} url
         */
        openNewWindow(url, width = 'auto', height = 'auto') {
            // 中央計算
            var width = width == 'auto' ? window.innerWidth * 0.8 : width;
            var height = height == 'auto' ? window.innerHeight * 0.9 : height;
            var left = window.innerWidth / 2;
            var top = window.innerHeight / 2;
            var x = left - width / 2 + window.screenX;
            var y = top - height / 2 + window.screenY;

            var windowConfig = [
                'top=' + y,
                'left=' + x,
                'width=' + width,
                'height=' + height,
                'menubar=no',
                'toolbar=no',
                'scrollbars=yes'
            ];
            window.open(url, '', windowConfig.join(','));
        },
        /**
         * Ajax通信を行う
         * @param {object} params
         * @param {object} thisArg - callback内でthisとして使用する値
         */
        ajax(params, thisArg) {
            var type = params.type ? params.type : 'POST';
            var data = params.data ? params.data : {};
            thisArg = thisArg || this;

            $.ajax({
                url: params.url,
                type: type,
                data: data,
                success: function (res) {
                    if (params.success) {
                        params.success.call(thisArg, res);
                    }
                },
                error: function (error) {
                    console.error(error);
                    if (params.error) {
                        params.error.call(thisArg);
                    }
                    alert(CONST_MSG_COMMUNICATION_ERROR);
                }
            });
        },
        /**
         * リダイレクトでPOSTを行う
         * @param {string} action
         * @param {object} data
         */
        redirectPost(action, data) {
            var form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.setAttribute('action', action);

            for (var key in data) {
                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', key);
                input.setAttribute('value', data[key]);

                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        },
        /**
         * 読み込みエラー画像を表示する
         * @param {event} e
         */
        errorImg(e) {
            e.srcElement.src = '/assets/images/parts/no_image.png';
        },
        /**
         * 拡張子を除いたファイル名を取得する
         * @param {string} fileNameWithExt
         */
        getFileName(fileNameWithExt) {
            var filename = null;

            if (fileNameWithExt.match(/\./g)) {
                filename = fileNameWithExt.split('.').slice(0, -1).join('.');
            } else {
                filename = fileNameWithExt;
            }

            return filename || fileNameWithExt;
        },
        /**
         * 入力可能文字数を取得する
         * @param {string} str
         * @return {number}
         */
        getStrLength(str) {
            if (str === undefined) {
                return null;
            }
            return kdUtility.getStrLength(str);
        },
        /**
         * 入力可能文字数を表示する
         * @param {string} str
         * @param {number} maxLength
         */
        strlen(str, maxLength) {
            if (str === undefined) {
                return '';
            }
            return '残り' + (maxLength - this.getStrLength(str)) + '文字';
        },
        /**
         * 文字数が上限を超えているかを判定する
         * @param {string} text
         * @param {number} maxLength
         * @return {boolean}
         */
        isOverText(text, maxLength) {
            return this.getStrLength(text) > maxLength;
        }
    }
};
