/**
 * サイドメニューを設定します
 * @type {SideMenu}
 */
var sideMenu = new (function () {
    'use strict';

    var self = this;

    var $body = null;
    var $menu = null;
    var $menuList = null;
    var $menuListItem = null;

    var menuStatusChangeEvent = null;
    var MENU_STATUS_CHANGE_EVENT_NAME = 'kdMenuStatusChange';

    var MENU_STATUS_ATTR = 'data-menu-status';
    var MENU_STATUS_OPEN = 'open';
    var MENU_STATUS_CLOSE = 'close';

    var MENU_LIST_STATUS_ATTR = 'data-menu-list-status';
    var MENU_LIST_STATUS_OPEN = 'open';
    var MENU_LIST_STATUS_CLOSE = 'close';

    /**
     * @constructor
     */
    $(function _construct() {
        _setElements();
        _setEvents();

        if (kdWindow.isPcSize()) {
            self.openMenu();
        }
    });

    /**
     * メニューステータスを取得する
     */
    self.getMenuStatus = function () {
        return $body.attr(MENU_STATUS_ATTR);
    };

    /**
     * メニューを開く
     */
    self.openMenu = function () {
        _resetMenuList();

        if (kdWindow.isMobileSize()) {
            // 背景固定
            kdWindow.onFixScroll();
        }

        _setMenuStatus(MENU_STATUS_OPEN);
    };

    /**
     * メニューを閉じる
     * @param {boolean} offFixScroll - 固定解除するかどうか
     */
    self.closeMenu = function (offFixScroll) {
        offFixScroll = offFixScroll === undefined ? true : offFixScroll;

        if (kdWindow.isMobileSize() && offFixScroll) {
            // 背景固定解除
            kdWindow.offFixScroll();
        }

        _setMenuStatus(MENU_STATUS_CLOSE);
    };

    /**
     * モバイル用メニューを閉じる
     * @param {boolean} offFixScroll - 固定解除するかどうか
     */
    self.closeMobileMenu = function (offFixScroll) {
        offFixScroll = offFixScroll === undefined ? true : offFixScroll;

        if (kdWindow.isMobileSize()) {
            self.closeMenu(offFixScroll);
        }
    };

    /**
     * メニューをトグル開閉する
     */
    self.toggleMenu = function () {
        var menuStatus = self.getMenuStatus();
        if (menuStatus === MENU_STATUS_OPEN) {
            self.closeMenu();
        } else {
            self.openMenu();
        }
    };

    /**
     * メニューの横幅を取得する
     * @param {number} - 横幅（px）
     */
    self.getMenuWidth = function () {
        return $menuList.innerWidth();
    };

    /**
     * メニューステータスを設定する
     * @param {string} status - ステータス
     * @return {boolean}
     */
    function _setMenuStatus(status) {
        switch (status) {
            case MENU_STATUS_OPEN:
            case MENU_STATUS_CLOSE:
                $body.attr(MENU_STATUS_ATTR, status);

                // イベント通知
                window.dispatchEvent(menuStatusChangeEvent);
                return true;

            default:
                return false;
        }
    }

    /**
     * メニューリストの開閉を切り替える
     */
    function _toggleMenuList(target) {
        var listStatus = _getMenuListStatus(target);
        if (listStatus === MENU_LIST_STATUS_OPEN) {
            listStatus = MENU_LIST_STATUS_CLOSE;
        } else {
            listStatus = MENU_LIST_STATUS_OPEN;
        }
        _setMenuListStatus(target, listStatus);
    }

    /**
     * メニューリストの開閉をリセットする
     */
    function _resetMenuList() {
        $menuListItem.each(function (_, elm) {
            var listStatus = _getMenuListStatus(elm);
            if (listStatus) {
                _setMenuListStatus(elm, MENU_LIST_STATUS_CLOSE);
            }
        });
    }

    /**
     * メニューリストのステータスを取得する
     * @param {object} target
     * @return {string} - メニューステータス
     */
    function _getMenuListStatus(target) {
        return $(target).parent().attr(MENU_LIST_STATUS_ATTR);
    }

    /**
     * メニューリストのステータスを設定する
     * @param {object} target
     * @param {string} status
     * @return {boolean} - 実行結果
     */
    function _setMenuListStatus(target, status) {
        switch (status) {
            case MENU_LIST_STATUS_OPEN:
            case MENU_LIST_STATUS_CLOSE:
                $(target).parent().attr(MENU_LIST_STATUS_ATTR, status);
                return true;

            default:
                return false;
        }
    }

    /**
     * 各要素を設定する
     */
    function _setElements() {
        $body = $('body');
        $menu = $('.js-side-menu');
        $menuList = $('.js-menu-list');
        $menuListItem = $('.js-menu-list > li > a');
    }

    /**
     * 各イベントを設定する
     */
    function _setEvents() {
        // 背景クリックイベント
        $menu.on('click', function (e) {
            var isClickBg = !$(e.target).closest('.menu-list').length;
            if (isClickBg) {
                self.closeMenu();
            }
        });

        // メニューリスト開閉要素クリックイベント
        $menuListItem.each(function (_, elm) {
            $(elm).on('click', function (e) {
                var listStatus = _getMenuListStatus(this);
                if (!listStatus) {
                    return;
                }

                var listTitle = $(this).parent().attr('title');
                listTitle = listTitle.replace('体験談', ''); // 体験談マンガ→マンガ
                switch (listStatus) {
                    case MENU_LIST_STATUS_OPEN: // 閉じるとき
                        ga(
                            'send',
                            'event',
                            'ヘッダー',
                            'click',
                            'ハンバーガーメニュー-' + listTitle + '閉じる'
                        );
                        break;

                    case MENU_LIST_STATUS_CLOSE: // 開けるとき
                        ga(
                            'send',
                            'event',
                            'ヘッダー',
                            'click',
                            'ハンバーガーメニュー-' + listTitle + '開く'
                        );
                        break;
                }

                e.preventDefault();
                _toggleMenuList(this);
            });
        });

        // デバイスサイズ変更イベント
        $(window).on(kdWindow.DEVICE_SIZE_CHANGE_EVENT_NAME, function () {
            if (kdWindow.isMobileSize()) {
                self.closeMenu();
                _resetMenuList();
            }

            if (kdWindow.isPcSize()) {
                kdWindow.offFixScroll();
                self.openMenu();
            }
        });

        // メニューステータス変更イベント設定
        if (document.documentMode) {
            // IEのため
            menuStatusChangeEvent = document.createEvent('Event');
            menuStatusChangeEvent.initEvent(MENU_STATUS_CHANGE_EVENT_NAME, true, true);
        } else {
            menuStatusChangeEvent = new Event(MENU_STATUS_CHANGE_EVENT_NAME);
        }
    }
})();
