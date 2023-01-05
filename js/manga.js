/**
 * マンガページ
 */
$(function () {
    var loading_screen = $('#loading');
    var likeGrp = $('.like-btn-grp-container');
    var tooltip = $('.tooltip');
    var likeBtn = $('#like-btn');
    var isTouch =
        'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    var startMangaScroll = 0;
    var btnLoadMore = $('#comment-more');
    var loadingIcon = $('.loading-icon');
    loadingIcon.hide();
    var manga_id = $('#manga-id').val();
    var token = $('#token').val();

    // 投稿時間計算
    function loopCommentTime() {
        pastTimeRefresh('.comment-contents');
        pastTimeRefresh('#manga-comment-list');
        setTimeout(loopCommentTime, 30 * 1000);
    }
    loopCommentTime();

    $(this).bind('contextmenu', function (e) {
        // 一旦外す
        e.preventDefault();
    });

    Strlen.setup('comment_manga_detail', comment_length_max);
    Strlen.setup('comment_manga_guestname', nickname_length_max);
    if (is_auth) {
        $('.close').click(function () {
            loading_screen.hide();
            $('.modal').hide();
        });
    }

    $('input[name="comment_manga_guestname"]').on('keydown', function (e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            return false;
        } else {
            return true;
        }
    });

    /* コメントの投稿 */
    $('#btn-comment').on('click', function () {
        commentSubmit();
    });

    function commentSubmit() {
        var comment = $('[name=comment_manga_detail]').val();
        var guestname = $('[name=comment_manga_guestname]').val();
        var name = typeof guestname === 'undefined' ? '' : guestname;
        if (comment.length > comment_length_max) {
            loading_screen.hide();
            customAlert(comment_length_max + '文字以内で入力をお願いします。');
            return;
        } else if (comment.length == 0) {
            loading_screen.hide();
            customAlert('コメントが入力されていません。');
            return;
        } else if (typeof guestname !== 'undefined' && name === '') {
            loading_screen.hide();
            customAlert('ニックネームが入力されていません。');
            return;
        }

        // 投稿内容確認
        var dialogMessage =
            '<div class="comment-title"><span>コメント</span></div>' +
            '<div class="comment">' +
            nl2br(htmlspecialchars(comment)) +
            '</div>';
        // 非会員
        if (typeof guestname !== 'undefined') {
            dialogMessage +=
                '<div class="nickname-title"><span>ニックネーム</span></div>' +
                htmlspecialchars(name);
        }

        dialogMessage += '<div class="ask"><span>～思いやりのある発言をお願いします～</span></div>';
        dialogMessage +=
            '<div><span class="good"><img src="img/img_ex-good.png"></span><span class="bad"><img src="img/img_ex-bad.png"></span></div>';
        // 注意事項
        dialogMessage +=
            '<div class="attention"><i class="fas fa-exclamation-triangle"></i><a href="/law" target="_blank" class="guideline">利用ガイドライン</a>をお読みになった上で投稿してください。こそだてDAYS編集部が不適切と判断した投稿は、削除する場合があります。</div>';
            console.log(dialogMessage);
        customConfirm(
            dialogMessage,
            function () {
                loading_screen.show();
                // ajax
                $.ajax({
                    type: 'POST',
                    url: 'manga/comment_post',
                    data: {
                        token: token,
                        manga_id: manga_id,
                        comment_manga_detail: comment,
                        comment_manga_guestname: name
                    },
                    cache: false,
                    success: function (res) {
                        loading_screen.hide();
                        var result = res.rslt;
                        if (result > 0) {
                            var comment_list = res.comment_list;
                            var html = commentHtmlCreate(comment_list);
                            $('#number-commnent').html(res.comment_list_offset_max);
                            if ($('.comment-counter').is(':hidden')) {
                                $('.comment-counter').show();
                            }
                            $(html).prependTo('#comment-list').hide().fadeIn(500);
                            var new_offset = res.comment_list_offset;
                            $('.offset').val(new_offset);
                            $('.offset-max').val(res.comment_list_offset_max);
                            $('[name=comment_manga_detail]').val('');
                            $('[name=comment_manga_guestname]').val('');
                            Strlen.setup('comment_manga_detail', comment_length_max);
                            pastTimeRefresh('#manga-comment-list');
                            var latestCommentNum = res.comment_list_offset_max;
                            $('.js-commentnum').text(latestCommentNum);
                        } else {
                            customAlert(res.description);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        loading_screen.hide();
                        customAlert('コメントの投稿に失敗しました。');
                    }
                });
            },
            function () {
                // キャンセル処理
            }
        );
    }

    function htmlspecialchars(str) {
        return (str + '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function nl2br(str) {
        str = str.replace(/\r\n/g, '<br>');
        str = str.replace(/(\n|\r)/g, '<br>');
        return str;
    }

    // テキストエリアの自動伸縮
    var commentArea = $('#manga-comment textarea');
    var commentAreaHeight = parseInt(commentArea.height());
    var commentAreaPadding = parseInt(commentArea.innerHeight()) - commentAreaHeight;
    $('#dialog-btn-ok').on('click', function () {
        commentArea.height(commentAreaHeight);
    });

    commentArea.on('input paste', function () {
        commentArea.height(0);
        commentArea.height(this.scrollHeight - (commentAreaPadding + 1));
    });

    /* コメントをもっと見る */
    function load_more_comment(offset, manga_id) {
        // ajax
        $.ajax({
            type: 'POST',
            url: 'manga/ajax_get_more_comment',
            data: {
                offset: offset,
                manga_id: manga_id
            },
            cache: false,
            success: function (res) {
                loadingIcon.hide();
                var result = res.rslt;
                if (result > 0) {
                    var comment_list = res.comment;
                    var html = commentHtmlCreate(comment_list);
                    $(html).appendTo('#comment-list').hide().fadeIn(500);
                    var new_offset = parseInt($('.offset').val(), 10) + comment_list.length;
                    $('.offset').val(new_offset);
                    if (new_offset < $('.offset-max').val()) {
                        $('#last-number-comment').html(
                            parseInt($('.offset-max').val(), 10) - new_offset
                        );
                        btnLoadMore.show();
                    }

                    pastTimeRefresh('#manga-comment-list');
                } else {
                    customAlert(res.description);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                loadingIcon.hide();
                customAlert('コメントの取得に失敗しました。');
            }
        });
    }

    function commentHtmlCreate(comment_list) {
        var html = '';
        for (var i = 0, cl = comment_list.length; i < cl; i++) {
            var comment = comment_list[i];
            var nickname =
                comment.user_nickname == null ? comment.guest_name : comment.user_nickname;
            var classNologin =
                comment.user_id == null || dummy_image_user_path == comment.icon_url
                    ? 'no-login'
                    : '';
            var classIconFrame =
                comment.user_id == null || dummy_image_user_path == comment.icon_url
                    ? 'icon-frame'
                    : '';
            html +=
                '<li class="item ' +
                classNologin +
                '" data-id="' +
                comment.comment_manga_id +
                '">\
                        <div class="icon">\
                            <span class="icon-bg ' +
                classIconFrame +
                '"><img src="' +
                comment.icon_url +
                '" alt="' +
                nickname +
                'さん" class="icon-frame"></span>\
                            <span class="user-name">' +
                nickname +
                '<span>さん</span></span>\
                       </div>\
                        <time class="post-time timecheck" datetime="' +
                comment.first_time +
                '"></time>\
                        <div class="body">\
                            <div class="text">\
                                ' +
                comment.comment_manga_detail +
                '\
                            </div>\
                        </div>\
                    </li>';
        }

        return html;
    }

    // reset offset element「もっと見る」を押して
    // 他のページへ移動してマイページへ戻る時、
    // 理由が分からないが、offsetの値が初期化しないため
    $('.offset').val($('.offset-org').val());
    btnLoadMore.click(function () {
        var offset = $('.offset').val();
        loadingIcon.show();
        btnLoadMore.hide();
        load_more_comment(offset, manga_id);
    });

    if (!isTouch) {
        /* Tooltipのhover */
        tooltip.mouseover(function () {
            $(this).children('span.tooltiptext').show();
            $(this).children('img').addClass('tooltip-hover');
        });
        tooltip.mouseout(function () {
            $(this).children('span.tooltiptext').hide();
            $(this).children('img').removeClass('tooltip-hover');
        });
    } else {
        $(window).scroll(function (e) {
            var manga_image_top =
                $('#scroll-base1').offset().top + ($('#scroll-base1').height() / 3 + 250);
            var manga_copy_right_top =
                $('#scroll-base1').offset().top + $('#scroll-base1').height();
            var currentPos = window.scrollY;
            var currentPos_delta = currentPos;
            if (currentPos > startMangaScroll) {
                // DOWN
                if (
                    currentPos_delta >= manga_image_top &&
                    currentPos_delta <= manga_copy_right_top
                ) {
                    likeGrp.addClass('like-btn-grp-container-active');
                    likeGrp.removeClass('like-btn-grp-container-fadein');
                } else {
                    likeGrp.removeClass('like-btn-grp-container-active');
                    likeGrp.addClass('like-btn-grp-container-fadein');
                }
            } else {
                likeGrp.removeClass('like-btn-grp-container-active');
                likeGrp.addClass('like-btn-grp-container-fadein');
            }

            startMangaScroll = currentPos;
        });
    }

    likeBtn.click(function () {
        clickLikeBtn();
    });

    tooltip.click(function () {
        tooltipClick(this);
    });

    function createLiketypestring($img_string, $text_string) {
        return '<img src="' + $img_string + '"><span>' + $text_string + '</span>';
    }

    function createLiketypeTextandIcon($liketype) {
        var liketypetext = '';
        var $img = '';
        var $text = '';
        if ($liketype === CONST_LIKE_STATUS_GOOD) {
            $img = CONST_LIKE_IMG_GOOD;
            $text = CONST_LIKE_NAME_GOOD;
        } else if ($liketype === CONST_LIKE_STATUS_ARUARU) {
            $img = CONST_LIKE_IMG_ARUARU;
            $text = CONST_LIKE_NAME_ARUARU;
        } else if ($liketype === CONST_LIKE_STATUS_LAUGH) {
            $img = CONST_LIKE_IMG_LAUGH;
            $text = CONST_LIKE_NAME_LAUGH;
        } else if ($liketype === CONST_LIKE_STATUS_JIIN) {
            $img = CONST_LIKE_IMG_JIIN;
            $text = CONST_LIKE_NAME_JIIN;
        } else if ($liketype === CONST_LIKE_STATUS_FUREFURE) {
            $img = CONST_LIKE_IMG_FUREFURE;
            $text = CONST_LIKE_NAME_FUREFURE;
        }

        liketypetext = createLiketypestring($img, $text);
        return liketypetext;
    }

    $('#like-counter-container').hide();
    $('.good-counter').click(function () {
        $('#like-counter-container').toggle('1000');
        $('.down-arrow').toggleClass('up-rotate');
    });
    function likeTextnumberDisplay($status, $likenum) {
        var like_num_message = '';
        if ($status == '1') {
            if ($likenum == 1) {
                like_num_message = 'あなた';
            } else {
                like_num_message = 'あなたと他' + ($likenum - 1) + '人';
            }
        } else {
            like_num_message = $likenum + '人';
        }

        return like_num_message;
    }

    /* いいねのアイコンと該当数の処理 */
    function tooltipClick(current) {
        var liketype = $(current).attr('data-liketype');
        var new_like_status = '1';
        $(current).children('img').addClass('tooltip-click');
        // ajax
        $.ajax({
            type: 'POST',
            url: 'manga/addLike/' + new_like_status + '/' + liketype,
            data: {
                manga_id: manga_id,
                token: token
            },
            cache: false,
            success: function (res) {
                $(current).children('img').removeClass('tooltip-click');
                likeGrp.hide();
                loading_screen.hide();
                var result = res.rslt;
                if (result > 0) {
                    $('#like-status').val(res.new_status);
                    var like_num_message = '';
                    like_num_message = likeTextnumberDisplay(res.new_status, res.new_like_num);
                    $('#like-num').html(like_num_message);
                    $('.like-btn-grp-container').hide();
                    if (res.new_like_num === 0) {
                        $('.like-counter-container').hide();
                    }

                    $('#like-counter-container').html(res.like_counter_string);
                    var liketypetext = '';
                    liketypetext = createLiketypeTextandIcon(liketype);
                    $('.like-btn-li').show();
                    $('#like-btn').html(liketypetext);
                    if (typeof ga !== 'undefined') {
                        var url_like = 'manga/addlike/' + liketype;
                        ga('send', 'pageview', url_like);
                    }
                } else {
                    likeGrp.show();
                    customAlert(res.description);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $(current).children('img').removeClass('tooltip-click');
                loading_screen.hide();
                customAlert('通信に失敗しました。' + XMLHttpRequest['responseText']);
            }
        });
    }

    /* いいねのボタンを押す */
    function clickLikeBtn() {
        loading_screen.show();
        var like_status = $('#like-status').val();
        var noLike =
            '<img class="icon-rainbow" src="' +
            CONST_LIKE_IMG_BROWN +
            '"> <span>' +
            CONST_LIKE_NAME_GOOD +
            '</span>';
        var defaultLike =
            '<img src="' + CONST_LIKE_IMG_GOOD + '"> <span>' + CONST_LIKE_NAME_GOOD + '</span>';
        var liketype = CONST_LIKE_STATUS_GOOD;
        var new_like_status;
        if (like_status === '1') {
            new_like_status = '0';
        } else {
            new_like_status = '1';
            if (typeof ga !== 'undefined') {
                var url_like = 'manga/addlike/' + liketype;
                ga('send', 'pageview', url_like);
            }
        }

        // ajax
        $.ajax({
            type: 'POST',
            url: 'manga/addLike/' + new_like_status + '/' + liketype,
            data: {
                manga_id: manga_id,
                token: token
            },
            cache: false,
            success: function (res) {
                loading_screen.hide();
                var result = res.rslt;
                if (result > 0) {
                    $('#like-status').val(res.new_status);
                    var like_num_message = '';
                    like_num_message = likeTextnumberDisplay(res.new_status, res.new_like_num);
                    $('#like-num').html(like_num_message);
                    $('.like-btn-grp-container').hide();
                    if (res.new_like_num === 0) {
                        $('#like-counter-container').hide();
                    }

                    $('#like-counter-container').html(res.like_counter_string);
                    if (res.new_status === '0') {
                        $('#like-btn a').html(noLike);
                        likeGrp.hide();
                        $('.like-btn-grp-container').show();
                        $('.like-btn-li').hide();
                    } else {
                        $('#like-btn a').html(defaultLike);
                    }
                } else {
                    customAlert(res.description);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                loading_screen.hide();
                customAlert('通信に失敗しました。' + XMLHttpRequest['responseText']);
            }
        });
    }

    $('.comment-btn-trigger').click(function () {
        $('#comment-form textarea').focus();
        var commentAreaTop = $('#manga-comment').offset().top - 10;
        $('html, body').animate({ scrollTop: commentAreaTop }, '200');
        ga('send', 'event', 'コメントアイコン', 'click');
    });

    $('#comment-more').click(function () {
        ga('send', 'event', 'コメントをもっとみる', 'click');
    });
});
