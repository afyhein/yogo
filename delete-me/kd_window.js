/**
 * ウィンドウ管理用オブジェクト
 * @type {KdWindow}
 */
var kdWindow = new (function () {
    'use strict';

    var self = this;

    var currentWindowWidth = null;
    var currentDeviceType = null;
    var scrollTop = 0;

    var deviceSizeChangeEvent = null;
    self.DEVICE_SIZE_CHANGE_EVENT_NAME = 'kdDeviceSizeChange';

    /**
     * デバイスタイプを取得する
     * @return {string} - pc | tablet | sp
     */
    self.getDeviceType = function () {
        if (currentWindowWidth > CONST_TABLET_BREAK_POINT) {
            return CONST_DEVICE_TYPE_PC;
        } else if (currentWindowWidth > CONST_SP_BREAK_POINT) {
            return CONST_DEVICE_TYPE_TABLET;
        } else {
            return CONST_DEVICE_TYPE_SP;
        }
    };

    /**
     * モバイルサイズ（タブレット or スマホ）かを判定する
     * @return {boolean}
     */
    self.isMobileSize = function () {
        var deviceType = self.getDeviceType();
        switch (deviceType) {
            case CONST_DEVICE_TYPE_TABLET:
            case CONST_DEVICE_TYPE_SP:
                return true;

            default:
                return false;
        }
    };

    /**
     * PCサイズかを判定する
     * @return {boolean}
     */
    self.isPcSize = function () {
        var deviceType = self.getDeviceType();
        switch (deviceType) {
            case CONST_DEVICE_TYPE_PC:
                return true;

            default:
                return false;
        }
    };

    /**
     * ウィンドウ情報を更新する
     */
    self.update = function () {
        currentWindowWidth = window.innerWidth;
        currentDeviceType = self.getDeviceType();
    };

    /**
     * スクロール固定中かを判定する
     * @returns {boolean}
     */
    self.isFix = function () {
        var bodyPositioinStyle = $('body').css('position');
        return bodyPositioinStyle === 'fixed';
    };

    /**
     * スクロールを固定する
     */
    self.onFixScroll = function () {
        if (self.isFix()) {
            return;
        }

        scrollTop = $(window).scrollTop();
        $('body').css({
            position: 'fixed',
            top: -scrollTop,
            right: 0,
            left: 0
        });
    };

    /**
     * スクロール固定を解除する
     */
    self.offFixScroll = function () {
        if (!self.isFix()) {
            return;
        }

        $('body').css({
            position: '',
            top: '',
            right: '',
            left: ''
        });

        if (scrollTop === 0) {
            return;
        }

        $('html, body').prop({
            scrollTop: scrollTop
        });
    };

    /**
     * デバイスサイズ変更通知のイベントを設定する
     */
    function _setDeviceSizeChengeEvent() {
        // イベント設定
        if (document.documentMode) {
            // IEのため
            deviceSizeChangeEvent = document.createEvent('Event');
            deviceSizeChangeEvent.initEvent(self.DEVICE_SIZE_CHANGE_EVENT_NAME, true, true);
        } else {
            deviceSizeChangeEvent = new Event(self.DEVICE_SIZE_CHANGE_EVENT_NAME);
        }

        $(window).on('resize', function () {
            var oldDeviceType = currentDeviceType;
            self.update();

            if (currentDeviceType === oldDeviceType) {
                return;
            }

            // イベント通知
            window.dispatchEvent(deviceSizeChangeEvent);
        });
    }

    /**
     * @constructor
     */
    (function _construct() {
        _setDeviceSizeChengeEvent();
        self.update();
    })();
})();
