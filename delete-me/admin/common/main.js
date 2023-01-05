var un = null;
var validation = null;
var fotterButtonsArea = null;

$(function () {
    // 伸縮コンテナ実行
    StretchContainer.init();

    // ユーザー通知
    un = new UserNotifications({
        offsetBottom: '4rem',
        offsetRight: '1rem'
    });

    // バリデーション
    validation = new kdValidation({
        moment: moment
    });

    // フッターボタン実行
    fotterButtonsArea = new FotterButtonsArea();
});

/**
 * 確認ビュー
 * @type {OverlayView}
 */
var confirmOverlayView = new OverlayView({
    target: 'confirm',
    showScrollArrow: true,
    scrollArrowPosition: 'center',
    scrollArrowOffset: { x: '0rem', y: '4.2rem' },
    openCallback: function () {
        fotterButtonsArea.hide();
    },
    closeCallback: function () {
        fotterButtonsArea.show();
    }
});

/**
 * File Api
 * @param {type} file
 * @param {type} result
 */
var FileApi = function (file, result) {
    var file = $(file)[0];
    var result = $(result);

    // File APIに対応しているか確認
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        function loadLocalImage(e) {
            // ファイル情報を取得
            var fileData = e.target.files[0];

            // 画像ファイル以外は処理を止める
            if (!fileData.type.match('image.*')) {
                alert('画像を選択してください');
                return;
            }

            // FileReaderオブジェクトを使ってファイル読み込み
            var reader = new FileReader();

            // ファイル読み込みに成功したときの処理
            reader.onload = function () {
                var img = document.createElement('img');
                img.src = reader.result;

                // リセット
                result.find('img').remove();

                result.append(img);
            };

            // ファイル読み込みを実行
            reader.readAsDataURL(fileData);
        }

        file.addEventListener('change', loadLocalImage, false);
    } else {
        alert('File APIに対応していません。');
    }
};

/**
 * 伸縮コンテナ
 */
var StretchContainer = {
    slideSpeed: 300,
    init: function () {
        $('body .stretch-container').each(function () {
            var title = $(this).attr('data-title');
            var id = $(this).attr('data-id');
            var attr = id ? ' id="' + id + '"' : '';

            var initState = $(this).attr('data-init');

            var defaultButton = 'up';
            if (initState == 'close') {
                defaultButton = 'down';
                attr += ' style="display:none;"';
            }

            $(this).attr('data-type', defaultButton);
            $(this).prepend('<div class="stretch-container-head">' + title + '</div>');
            $(this)
                .children(':not(.stretch-container-head)')
                .wrapAll('<div class="stretch-container-hidden"' + attr + '>');
        });

        this.toggleSlide();
    },
    toggleSlide: function () {
        $(document).on('click', '.stretch-container-head', function () {
            var inputSection = $(this).parent('.stretch-container');
            var inputSectionContainer = inputSection.find('.stretch-container-hidden');
            var inputSectionType = inputSection.attr('data-type');

            if (inputSectionType === 'up') {
                inputSectionContainer.slideUp(StretchContainer.slideSpeed);
                inputSection.attr('data-type', 'down');
            } else {
                inputSectionContainer.slideDown(StretchContainer.slideSpeed);
                inputSection.attr('data-type', 'up');
            }
        });
    }
};

/**
 * 下部固定フッターボタン
 */
function FotterButtonsArea() {
    var self = this;
    var SHADOW_CLASS = 'top-shdow';
    var $footerButtons = null;

    /**
     * @constructor
     */
    $(function () {
        $footerButtons = $('#footer-buttons');
        if (!$footerButtons) {
            return;
        }

        // 非表示
        if (hideFotterButtonArea === 'true') {
            self.hide();
            return;
        }

        setEvents();
        update();
    });

    /**
     * 表示する
     */
    self.show = function () {
        $footerButtons.show();
    };

    /**
     * 非表示にする
     */
    self.hide = function () {
        $footerButtons.hide();
    };

    /**
     * イベントを設定する
     */
    function setEvents() {
        // サイドメニュー変更時
        $(window).on('kdMenuStatusChange', function () {
            update();
        });

        // スクロール時
        $(window).on('scroll', function () {
            update();
        });
    }

    /**
     * フッターエリアのスタイルを更新する
     */
    function update() {
        if (kdWindow.isPcSize()) {
            var sideMenuWidth = sideMenu.getMenuWidth();
            $footerButtons.css('left', sideMenuWidth);
        } else {
            $footerButtons.css('left', 0);
        }

        var docHeight = $(document).innerHeight();
        var winHeight = $(window).innerHeight();
        var scrollTop = $(window).scrollTop();

        var diff = docHeight - winHeight;
        if (diff <= 0 || diff <= scrollTop) {
            $footerButtons.removeClass(SHADOW_CLASS);
        } else {
            $footerButtons.addClass(SHADOW_CLASS);
        }
    }
}

/**
 * セグメントスイッチ
 */
var SegmentedControl = {
    init: function (action) {
        $(document).on('click', '.segmented-control .btn', function () {
            SegmentedControl.switchBtn(this);

            var btnValue = $(this).attr('data-value');
            SegmentedControl.doProcess(btnValue, action);
        });
    },
    switchBtn: function (obj) {
        var btnStatus = $(obj).attr('data-status');

        if (btnStatus === 'active') {
            return;
        }

        $('.segmented-control [data-status="active"]').attr('data-status', '');
        $(obj).attr('data-status', 'active');
    },
    doProcess: function (btnValue, action) {
        action[btnValue]();
    },
    errorMessage(message) {
        alert(message);
    }
};

/**
 * 新規ウィンドウ
 */
function openNewWindw(targetUrl) {
    var top = window.innerHeight / 2;
    var left = window.innerWidth / 2;
    var width = window.innerWidth * 0.7;
    var height = window.innerHeight * 0.7;
    var x = left - width / 2;
    var y = top - height / 2;

    var PREVIEW_URL = targetUrl;
    var windowName = null;
    var option =
        'top=' +
        y +
        ',left=' +
        x +
        ', width=' +
        width +
        ', height=' +
        height +
        ',menubar=no, toolbar=no, location=no';
    var result = window.open(PREVIEW_URL, windowName, option);

    if (result) {
        // Do nothing
    } else {
        alert('正常に開けませんでした。');
        result.close();
    }
}
