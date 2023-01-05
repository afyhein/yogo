/**
 * 検索結果ページ
 */
$(function () {
    'use strict';

    /**
     * タグを設定する
     */
    new KdTag({
        template:
            '<a href="{{url}}" class="tag hover-border"><i class="fas fa-hashtag"></i>{{tagName}}</a>'
    });
});
