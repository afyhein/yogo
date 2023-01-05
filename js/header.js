$(function () {
    'use strict';

    var $menuIcon = $('.js-menu-icon');
    var $menuCloseIcon = $('.js-menu-close-icon');

    /**
     * サイドメニューを設定する
     */
    $menuIcon.on('click', function () {
        sideMenu.openMenu();
    });
    $menuCloseIcon.on('click', function () {
        sideMenu.closeMenu();
    });

    /**
     * 検索画面を設定する
     */
    var searchOverlayView = new OverlayView({
        target: 'search',
        showScrollArrow: false,
        openCallback: function () {
            sideMenu.closeMobileMenu(false);
            topScrollBtn.hide();
            shareBtn.hideOpenCloseShareBtn();
        },
        closeCallback: function () {
            topScrollBtn.show();
            shareBtn.showOpenCloseShareBtn();
        }
    });
});


// window.addEventListener('resize',function(event) {
//     if(this.window.screen.width >= CONST_TABLET_BREAK_POINT){
//         document.querySelector('.js-menu-close-icon').style.display = 'none';
//         document.querySelector('.js-menu-icon').style.display = 'none';
//         document.querySelector('.production').dataset.menuStatus = 'close';
//     }else{
//         if(document.querySelector('.production').dataset.menuStatus == 'close'){
//             sideMenu.classList.remove('open');
//             document.querySelector('.js-menu-icon').style.display = 'flex';
//         }
//     }
// },true);