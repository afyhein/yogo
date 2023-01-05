/**
 * オーバーレイビューを設定する
 * @type {OverlayView}
 * @param {object} params
 * @example
 * new OverlayView({
 *   target: 'TARGET_NAME',
 *   openCallback: function () { },
 *   closeCallback: function () { },
 * });
 *
 * data-overlay-target="TARGET_NAME" // 表示要素につける
 * data-overlay-open="TARGET_NAME" // 開くボタンにつける
 */
var OverlayView = function (params) {
    'use strict';

    var self = this;

    var props = {
        target: null,
        showScrollArrow: true,
        scrollArrowPosition: 'center', // or right
        scrollArrowOffset: { x: '0px', y: '0px' },
        openCallback: null,
        closeCallback: null
    };

    self.$overlayView = null;
    self.$contents = null;

    var $scrollArrow = $('<i class="fas fa-chevron-down scroll-arrow hover-translucent"></i>');

    var TAERGET_ATTR_NAME = 'data-overlay-target';
    var OPEN_ATTR_NAME = 'data-overlay-open';
    var STATUS_SHOW = 'show';
    var STATUS_HIDE = 'hide';

    /**
     * @constructor
     */
    (function _construct() {
        _overrideProps();
        if (!props.target) {
            return;
        }

        _setView();
        if (!self.$overlayView) {
            return;
        }

        _setEvents();
    })();

    /**
     * プロパティを上書きする
     */
    function _overrideProps() {
        Object.keys(params).forEach(function (key) {
            props[key] = params[key];
        });
    }

    /**
     * 各イベントを設定する
     */
    function _setEvents() {
        // 表示
        $('[' + OPEN_ATTR_NAME + '=' + props.target + ']').each(function (_, elm) {
            $(elm).on('click', function () {
                // console.log('clicked')
                self.openView();
            });
        });

        // 非表示（閉じるボタン）
        self.$overlayView.find('.js-overlay-view-close').on('click', function () {
            self.closeView();
        });

        // 非表示（背景）
        self.$overlayView.on('click', function (e) {
            var isBackground = !$(e.target).closest('.js-inner').length;
            if (isBackground) {
                self.closeView();
            }
        });
    }

    /**
     * ルートビューを取得する
     */
    function _setView() {
        self.$contents = $('[' + TAERGET_ATTR_NAME + '=' + props.target + ']');
        self.$overlayView = self.$contents.parents('.js-overlay-view');
    }

    /**
     * スクロールをリセットする
     */
    function _resetScroll() {
        self.$contents.scrollTop(0);
    }

    /**
     * スクロールアイコンをセットする
     */
    function _setScrollArrow() {
        var offsetHeight = self.$contents.get(0).offsetHeight;
        var scrollHeight = self.$contents.get(0).scrollHeight;

        if (offsetHeight < scrollHeight) {
            var scrollArrowStyle = {
                'margin-bottom': props.scrollArrowOffset.y
            };

            switch (props.scrollArrowPosition) {
                case 'right':
                    scrollArrowStyle.right = '1.2rem';
                    scrollArrowStyle['margin-right'] = props.scrollArrowOffset.x;
                    break;

                case 'center':
                    scrollArrowStyle.right = '0';
                    scrollArrowStyle.left = '0';
                    scrollArrowStyle['margin-right'] = 'auto';
                    scrollArrowStyle['margin-left'] = 'auto';
                    break;
            }

            $scrollArrow.css(scrollArrowStyle);

            self.$contents.parents('.js-overlay-view').find('.js-inner').append($scrollArrow);

            $scrollArrow.on('click', function () {
                self.$contents.animate({ scrollTop: 200 });
                $scrollArrow.fadeOut(400);
            });

            self.$contents.on('scroll', function () {
                if ($scrollArrow.css('display') === 'none') {
                    return;
                }

                $scrollArrow.fadeOut(400);
            });
        }
    }

    /**
     * ビューを表示する
     */
    self.openView = function () {
        // 背景固定
        kdWindow.onFixScroll();

        // Vue.js対策
        _setView();

        self.$overlayView.attr('data-overlay-status', STATUS_SHOW);

        // スクロール位置リセット
        _resetScroll();

        // スクロールアイコンセット
        if (props.showScrollArrow) {
            _setScrollArrow();
        }

        // コールバック
        if (props.openCallback) {
            props.openCallback();
        }
    };

    /**
     * ビューを非表示にする
     */
    self.closeView = function () {
        // 背景固定解除
        kdWindow.offFixScroll();

        // Vue.js対策
        _setView();

        self.$overlayView.attr('data-overlay-status', STATUS_HIDE);

        // コールバック
        if (props.closeCallback) {
            props.closeCallback();
        }
    };
};
