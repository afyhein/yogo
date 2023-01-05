/**
 * トップページ
 */
$(function () {
    'use strict';

    /**************************************
     * ピックアップ
     **************************************/
    /**
     * タグを設定する
     */
    new KdTag({
        template:
            '<a href="{{url}}" class="tag hover-border"><i class="fas fa-hashtag"></i>{{tagName}}</a>'
    });

    /**************************************
     * みんなのコメント
     **************************************/
    /**
     * コメントスライダー
     */
    createSwiper({
        target: '#comment-swiper',
        nextEl: '.js-comment-swiper-next',
        prevEl: '.js-comment-swiper-prev'
    });

    /**
     * 投稿時間計算
     */
    function updateCommentTime() {
        pastTimeRefresh('.js-comment-container');
        setTimeout(updateCommentTime, 30 * 1000);
    }
    updateCommentTime();

    /**************************************
     * みんなのランキング
     **************************************/
    var rankingSwiper = null;

    /**
     * ページ読み込み時に、スライダー表示を切り替える
     */
    if (kdWindow.isMobileSize()) {
        rankingSwiper = createSwiper({
            target: '#ranking-swiper',
            nextEl: '.js-ranking-swiper-next',
            prevEl: '.js-ranking-swiper-prev'
        });
    }

    /**
     * リサイズ時に、スライダー表示を切り替える
     */
    $(window).on(kdWindow.DEVICE_SIZE_CHANGE_EVENT_NAME, function () {
        if (rankingSwiper) {
            rankingSwiper.destroy();
        }

        if (kdWindow.isMobileSize()) {
            rankingSwiper = createSwiper({
                target: '#ranking-swiper',
                nextEl: '.js-ranking-swiper-next',
                prevEl: '.js-ranking-swiper-prev'
            });
        }
    });

    /**************************************
     * おすすめ育児グッズ
     **************************************/
    var $recommendGoodsSwiperWrapper = $('.js-recommend-goods-swiper-wrapper');
    var recommendGoodsSwiper = null;

    /**
     * ページ読み込み時に、スライダー表示を切り替える
     */
    if (kdWindow.isMobileSize()) {
        recommendGoodsSwiper = createSwiper({
            target: '#recommend-goods-swiper',
            nextEl: null,
            prevEl: null
        });
    }

    if (kdWindow.isPcSize()) {
        switchRecommendGoodsScrollStyle();
    }

    /**
     * リサイズ時に、スライダー表示を切り替える
     */
    $(window).on(kdWindow.DEVICE_SIZE_CHANGE_EVENT_NAME, function () {
        if (recommendGoodsSwiper) {
            recommendGoodsSwiper.destroy();
        }

        if (kdWindow.isMobileSize()) {
            recommendGoodsSwiper = createSwiper({
                target: '#recommend-goods-swiper',
                nextEl: '.js-recommend-goods-swiper-next',
                prevEl: '.js-recommend-goods-swiper-prev'
            });
        }
    });

    $(window).on('resize', function () {
        switchRecommendGoodsScrollStyle();
    });

    /**
     * 表示がオーバーしている場合に
     * scrollクラスを付与する
     */
    function switchRecommendGoodsScrollStyle() {
        // justify-content:center で
        // overflow:auto が見切れる対応。
        if (isRecommendGoodsOverflow()) {
            $recommendGoodsSwiperWrapper.addClass('scroll');
        } else {
            $recommendGoodsSwiperWrapper.removeClass('scroll');
        }
    }

    /**
     * 表示がオーバーしているかを判定する
     * @return {boolean}
     */
    function isRecommendGoodsOverflow() {
        var clientWidth = $recommendGoodsSwiperWrapper.prop('clientWidth');
        var scrollWidth = $recommendGoodsSwiperWrapper.prop('scrollWidth');
        return clientWidth - scrollWidth < 0 ? true : false;
    }

    /**************************************
     * その他
     **************************************/
    /**
     * スワイパーインスタンスを作成する
     * @param {object} params
     * @return {swiper}
     */
    function createSwiper(params) {
        return new Swiper(params.target, {
            slidesPerView: 'auto',
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: params.nextEl,
                prevEl: params.prevEl
            }
        });
    }
});
