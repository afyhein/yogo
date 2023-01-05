/**
 * 検索オーバーレイビュー
 */
$(function () {
    'use strict';

    var $freewordInputWrap = $('.js-normal-input-wrap');
    var $freewordInput = $('.js-normal-freeword-input');
    var $freewordReset = $('.js-normal-freeword-reset');
    var $freewordSubmit = $('.js-normal-freeword-submit');

    var FREEWORD_GET_NAME = 'freeword';
    var MAX_INPUT_LENGTH = 30;
    var NOMAL_BG_COLOR = '#fff';
    var ERROR_BG_COLOR = '#fed7d7';

    /**
     * 入力イベント
     * @param {event} e
     */
    function onInputKeyword(e) {
        // リセットボタン表示切り替え
        var input = getInputText();
        if (input.trimText === '') {
            $freewordReset.hide();
        } else {
            $freewordReset.show();
            $freewordInput.css('background-color', NOMAL_BG_COLOR);
        }
    }
    $freewordInput.on('input', onInputKeyword);

    /**
     * キープレスイベント
     * @param {event} e
     */
    function onInputKeypress(e) {
        if (e.key === 'Enter') {
            searchSubmit();
        }
    }
    $freewordInput.on('keypress', onInputKeypress);

    /*
     * フォーカスイベント
     * @param {event} e
     */
    function onInputFocus(e) {
        $freewordInputWrap.addClass('outline');
    }
    $freewordInput.on('focus', onInputFocus);

    /*
     * ブラーイベント
     * @param {event} e
     */
    function onInputBlur(e) {
        $freewordInputWrap.removeClass('outline');
    }
    $freewordInput.on('blur', onInputBlur);

    /**
     * リセットボタンクリック時イベント
     * @param {event} e
     */
    function onClickReset(e) {
        // 入力欄リセット
        restInputText();
    }
    $freewordReset.on('click', onClickReset);

    /**
     * サブミットボタンクリック時イベント
     * @param {event} e
     */
    function onClickSubmit(e) {
        searchSubmit();
    }
    $freewordSubmit.on('click', onClickSubmit);

    /**
     * フリーワード検索を実行する
     */
    function searchSubmit() {
        var input = getInputText();
        if (input.trimText === '' || input.length > MAX_INPUT_LENGTH) {
            $freewordInput.css('background-color', ERROR_BG_COLOR);
            $freewordInput.focus();
            return;
        }
        location.href = '/search?' + FREEWORD_GET_NAME + '=' + encodeURIComponent(input.trimText);
    }

    /**
     * 入力文字を取得する
     * @return {object}
     */
    function getInputText() {
        var inputText = $freewordInput.val();

        // トリム処理
        return {
            length: inputText.length,
            rawText: inputText,
            trimText: inputText.replace(/^[\s|　]+|[\s|　]+$/g, '')
        };
    }

    /**
     * 入力欄をリセットする
     */
    function restInputText() {
        $freewordInput.val('');
        $freewordInput.css('background-color', NOMAL_BG_COLOR);
        $freewordReset.hide();
    }
});
