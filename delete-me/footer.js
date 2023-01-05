function openSideMenu() {
    kdWindow.onFixScroll();

    $('#side-menu-bg').fadeIn();
    $('#side-menu').css('left', '0px').addClass('side-menu-shadow');
    $('.menu-btn-sp').addClass('open');
    $('.menu-btn-sp').addClass('fa-times').removeClass('fa-bars');
}

function closeSideMenu() {
    kdWindow.offFixScroll();

    $('#side-menu-bg').fadeOut();

    $('#side-menu').css('left', '-250px').removeClass('side-menu-shadow');
    $('.menu-btn-sp').removeClass('open');
    $('.menu-btn-sp').removeClass('fa-times').addClass('fa-bars');
}

$(function () {
    var header = $('#cb-header');
    var startPos = 0;
    var startSpeed = 0;
    var wasClickTop = false;
    var wasClickMoveDiv = false;

    /* ---- サイドメニューの開閉 ---- */
    function isOpenMenu() {
        return $('#side-menu').css('left') === '0px' ? true : false;
    }

    $('.menu-btn-sp').click(function () {
        var analyticsKey = 'ヘッダー';

        if ($('#side-menu').css('display') === 'none') {
            return true;
        }

        if (isOpenMenu()) {
            closeSideMenu();
            ga('send', 'event', analyticsKey, 'click', 'ハンバーガーメニュー閉じる');
        } else {
            openSideMenu();
            ga('send', 'event', analyticsKey, 'click', 'ハンバーガーメニュー開く');
        }

        return false;
    });

    //メニュー外タッチ処理
    $(document).on('click touchend', function (e) {
        if (!isOpenMenu()) {
            return;
        }

        if (!$(event.target).closest('#side-menu').length) {
            closeSideMenu();
            return false;
        }
    });

    //横スワイプで閉じる
    $('#side-menu').on('touchstart', onTouchStart);
    $('#side-menu').on('touchmove', onTouchMove);
    var position;

    //スワイプ開始時の横方向の座標を格納
    function onTouchStart(event) {
        position = getPosition(event);
    }

    //スワイプの方向を取得
    function onTouchMove(event) {
        // 70px以上移動しなければスワイプと判断しない
        if (position - getPosition(event) > 70) {
            closeSideMenu();
        }
    }

    //横方向の座標を取得
    function getPosition(event) {
        return event.originalEvent.touches[0].pageX;
    }

    function sign(x) {
        return typeof x === 'number' ? (x ? (x < 0 ? -1 : 1) : x === x ? x : NaN) : NaN;
    }

    function hideHeader() {
        var menuHeight = header.height();
        $('#cb-header').css('top', '-' + menuHeight + 'px');
    }

    function showHeader() {
        $('#cb-header').css('top', 0 + 'px');
    }

    function cleanScreenForDialog() {
        if ($(window).scrollTop() >= 200) {
            hideHeader();
        } else {
            showHeader();
        }
    }

    $(window).scroll(function (e) {
        var target = e.currentTarget,
            currentPos = target.scrollTop || window.pageYOffset,
            scrollHeight = target.scrollHeight || document.body.scrollHeight;

        if (currentPos < 0) {
            // TOPの位置
            currentPos = 0;
        }

        if (currentPos + window.innerHeight <= scrollHeight) {
            // iPhoneのbounce対策
            var currentSpeed = currentPos - startPos;
            if (sign(currentSpeed) !== sign(startSpeed)) {
                // 時々、位置の値の順番が乱れる
                // 10,9,8,7,6...ではなく、10,9,12,8,5
            } else {
                if (!wasClickTop && !wasClickMoveDiv) {
                    if (
                        ($('#loading').length === 0 && $('#dialog').length === 0) ||
                        ($('#loading').css('display') === 'none' &&
                            $('#dialog').css('display') === 'none')
                    ) {
                        // 少しだけついてくるように調整
                        if (currentPos > startPos + 5) {
                            var menuHeight = header.height();
                            header.css('top', '-' + menuHeight + 'px');
                            $('.menu-btn-sp').addClass('up');
                        } else if (currentPos < startPos) {
                            $('.menu-btn-sp').removeClass('up');
                            header.css('top', 0 + 'px');
                        }
                    } else {
                        cleanScreenForDialog();
                    }
                }

                startPos = currentPos;
            }

            startSpeed = currentSpeed;
        }
    });
});
