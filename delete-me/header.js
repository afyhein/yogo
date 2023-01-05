$(function () {
    'use strict';

    var $menuIcon = $('.js-menu-icon');
    var $menuCloseIcon = $('.js-menu-close-icon');

    /**
     * サイドメニューを設定する
     */
    $menuIcon.on('click', function () {
        ga('send', 'event', 'ヘッダー', 'click', 'ハンバーガーメニュー開く');
        sideMenu.openMenu();
    });
    $menuCloseIcon.on('click', function () {
        ga('send', 'event', 'ヘッダー', 'click', 'ハンバーガーメニュー閉じる');
        sideMenu.closeMenu();
    });

    /**
     * 検索画面を設定する
     */
    var searchOverlayView = new OverlayView({
        target: 'search',
        showScrollArrow: false,
        openCallback: function () {
            ga('send', 'event', 'ヘッダー', 'click', '検索');
            sideMenu.closeMobileMenu(false);
            topScrollBtn.hide();
            shareBtn.hideOpenCloseShareBtn();
        },
        closeCallback: function () {
            ga('send', 'event', '検索POPUP', 'click', '閉じる');
            topScrollBtn.show();
            shareBtn.showOpenCloseShareBtn();
        }
    });
});
