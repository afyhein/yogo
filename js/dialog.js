/**
 * アラートダイアログ
 * @param {string} message
 * @param {function} okCallback
 */
function customAlert(message, okCallback) {
    kdWindow.onFixScroll();

    $('#dialog-btn-cancel').hide();
    $('#dialog-message').empty().html(message);

    var dialogObj = $('#dialog');
    dialogObj.fadeIn(100);
    setDialogLayout();

    // OK
    $('#dialog-btn-ok').click(function () {
        kdWindow.offFixScroll();

        if (okCallback != undefined) {
            okCallback();
        }

        dialogObj.fadeOut(100);
        $('#dialog-btn-ok').unbind('click');
    });

    // キャンセル
    $('#dialog-btn-cancel').click(function () {
        kdWindow.offFixScroll();

        dialogObj.fadeOut(100);
        $('#dialog-btn-cancel').unbind('click');
    });
}

/**
 * 確認ダイアログ
 * @param {string} message
 * @param {function} okCallback
 * @param {function} noCallback
 */
function customConfirm(message, okCallback, noCallback) {
    kdWindow.onFixScroll();

    $('#dialog-btn-cancel').show();
    $('#dialog-message').empty().html(message);

    var dialogObj = $('#dialog');
    dialogObj.fadeIn(100);
    setDialogLayout();

    // OK
    $('#dialog-btn-ok').on('click', function () {
        kdWindow.offFixScroll();

        dialogObj.fadeOut(100);

        if (okCallback) {
            okCallback();
        }

        $('#dialog-btn-ok').off('click');
        $('#dialog-btn-cancel').off('click');
    });

    // キャンセル
    $('#dialog-btn-cancel').on('click', function () {
        kdWindow.offFixScroll();

        dialogObj.fadeOut(100);

        if (noCallback) {
            noCallback();
        }

        $('#dialog-btn-ok').off('click');
        $('#dialog-btn-cancel').off('click');
    });
}

/**
 * ダイアログのレイアウトを設定する
 */
function setDialogLayout() {
    var $dialogInner = $('#dialog-inner');
    var windowHeight = $(window).innerHeight();
    var dialogHeight = $dialogInner.innerHeight();
    $dialogInner.css('margin-top', windowHeight / 2 - dialogHeight / 2);
}

/**
 * ログアウトダイアログを表示する
 * @param {string} redirectUrl
 */
function logout(redirectUrl) {
    customConfirm(
        '本当にログアウトしますか？',
        function () {
            window.location = redirectUrl;
        },
        function () {}
    );
}
