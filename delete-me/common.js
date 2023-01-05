/**
 * 共通スクリプト
 */
$(function () {
    'use strict';

    /**
     * LazyLoad
     */
    var $images = document.querySelectorAll('.lazyload');
    new LazyLoad($images, {
        root: null,
        rootMargin: '5%',
        threshold: 0
    });
});
