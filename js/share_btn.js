/**
 * シェアボタン
 * @type {ShareBtn}
 */
var shareBtn = new (function () {
    'use strict';

    var self = this;

    var $shareBtnOpenClose = null;
    var $shareBtnScrollBase = null;
    var $footer = null;

    var shareBtnScrollBaseTop = -500; // バウンス分マイナス

    var WINDOW_WIDTH = 700;
    var WINDOW_HEIGHT = 436;

    /**
     * @constructor
     */
    $(function _construct() {
        _getElements();

        if (!isExistOpenCloseShareBtn()) {
            return;
        }

        // 基準があれば設定する
        if ($shareBtnScrollBase.length) {
            shareBtnScrollBaseTop = $shareBtnScrollBase.offset().top;
        }

        _setEvents();
        _updateDisplay();
    });

    /**
     * SNSウィンドウを開く
     * @param {string} snsName
     * @param {string} shapeName
     */
    self.openWindow = function (snsName, shapeName) {
        var snsType = '';
        var utmSourceType = '';

        switch (snsName) {
            case CONST_SNS_TWITTER:
                snsType = 'Twitter';
                utmSourceType = 'twitter';
                break;

            case CONST_SNS_FACEBOOK:
                snsType = 'Facebook';
                utmSourceType = 'facebook';
                break;

            case CONST_SNS_LINE:
                snsType = 'Line';
                utmSourceType = 'line';
                break;
        }

        var currentUrl = 'https://' + location.host + location.pathname;
        var params = ['utm_source=' + utmSourceType, 'utm_medium=sns'];
        var paramsStr = params.join(escape('&'));
        var openUrl = '';
        var dialogType = '';

        switch (snsName) {
            case CONST_SNS_TWITTER:
                openUrl =
                    'https://twitter.com/share?url=' +
                    currentUrl +
                    '?' +
                    paramsStr +
                    '&text=' +
                    shareText +
                    '&hashtags=育児漫画,子育てあるある%0a@kosodatedaysさんから';
                dialogType = 'twitter-share-dialog';
                break;

            case CONST_SNS_FACEBOOK:
                openUrl =
                    'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl + '?' + paramsStr;
                dialogType = 'facebook-share-dialog';
                break;

            case CONST_SNS_LINE:
                openUrl = 'http://line.me/R/msg/text/?' + currentUrl + '?' + paramsStr;
                dialogType = 'line-share-dialog';
                break;
        }

        _openNewWindow(openUrl, dialogType);
    };

    /**
     * 開閉式シェアボタンを表示する
     */
    self.showOpenCloseShareBtn = function () {
        if (!isExistOpenCloseShareBtn()) {
            return;
        }

        $shareBtnOpenClose.show();
    };

    /**
     * 開閉式シェアボタンを非表示にする
     */
    self.hideOpenCloseShareBtn = function () {
        if (!isExistOpenCloseShareBtn()) {
            return;
        }

        $shareBtnOpenClose.hide();
    };

    /**
     * 開閉式シェアボタンの存在を判定する
     * @return {boolean} - ボタンの存在
     */
    function isExistOpenCloseShareBtn() {
        return $shareBtnOpenClose.length > 0;
    }

    /**
     * 要素を取得する
     */
    function _getElements() {
        $shareBtnOpenClose = $('.js-share-btn-open-close');
        $shareBtnScrollBase = $('.js-share-btn-scroll-base');
        $footer = $('.js-footer');
    }

    /**
     * イベントを設定する
     */
    function _setEvents() {
        // スクロール時
        $(window).on('scroll', function () {
            _updateDisplay();
        });

        // サイドメニュー変更時
        $(window).on('kdMenuStatusChange', function () {
            // PCサイズ時
            if (kdWindow.isPcSize()) {
                self.showOpenCloseShareBtn();
                return;
            }

            // モバイルサイズ時
            var menuStatus = sideMenu.getMenuStatus();
            if (menuStatus === 'open') {
                self.hideOpenCloseShareBtn();
            } else {
                self.showOpenCloseShareBtn();
            }
        });
    }

    /**
     * 開閉式シェアボタンの表示を更新する
     */
    function _updateDisplay() {
        // 背景固定対応
        var bodyPositioinStyle = $('body').css('position');
        if (bodyPositioinStyle === 'fixed') {
            return;
        }

        var scrollTop = $(window).scrollTop();
        var scrollBottom = $(window).height() + scrollTop;

        var isPassedScrollBase = scrollTop >= shareBtnScrollBaseTop;
        var isPassedFooterTop = scrollBottom > $footer.offset().top;

        if (isPassedScrollBase && !isPassedFooterTop) {
            self.showOpenCloseShareBtn();
        } else {
            self.hideOpenCloseShareBtn();
        }
    }

    /**
     * 新規ウィンドウを開く
     * @param {string} openUrl
     * @param {string} dialogType
     */
    function _openNewWindow(openUrl, dialogType) {
        // 中央計算
        var top = window.innerHeight / 2;
        var left = window.innerWidth / 2;
        var width = WINDOW_WIDTH;
        var height = WINDOW_HEIGHT;
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
        window.open(openUrl, dialogType, windowConfig.join(','));
    }
})();
