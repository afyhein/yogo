/**
 * 上部へスクロールするボタン
 * @type {TopScrollBtn}
 */
var topScrollBtn = new (function () {
    'use strict';

    var self = this;

    var $topScrollBtn = null;

    /**
     * @constructor
     */
    $(function _construct() {
        $topScrollBtn = $('.js-top-scroll-btn');

        if (!isExist()) {
            return;
        }

        _setEvents();
        _updateDisplay();
    });

    /**
     * ページ上部に移動する
     */
    self.moveToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, '200');
    };

    /**
     * ボタンを表示する
     */
    self.show = function () {
        if (!isExist()) {
            return;
        }

        if (kdWindow.isFix()) {
            return;
        }

        $topScrollBtn.show();
    };

    /**
     * ボタンを非表示にする
     */
    self.hide = function () {
        if (!isExist()) {
            return;
        }

        $topScrollBtn.hide();
    };

    /**
     * ボタンの存在を判定する
     * @return {boolean} - ボタンの存在
     */
    function isExist() {
        return $topScrollBtn.length > 0;
    }

    /**
     * イベントを設定する
     */
    function _setEvents() {
        // スクロール時
        $(window).scroll(function () {
            _updateDisplay();
        });

        // ボタンクリック時
        $topScrollBtn.on('click', self.moveToTop);

        // サイドメニュー変更時
        $(window).on('kdMenuStatusChange', function () {
            // PCサイズ時
            if (kdWindow.isPcSize()) {
                self.show();
                return;
            }

            // モバイルサイズ時
            var menuStatus = sideMenu.getMenuStatus();
            if (menuStatus === 'open') {
                self.hide();
            } else {
                self.show();
            }
        });
    }

    /**
     * 表示を更新する
     */
    function _updateDisplay() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > 0) {
            self.show();
        } else {
            self.hide();
        }
    }
})();
