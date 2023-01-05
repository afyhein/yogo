var rankingType = $('#ranking-type');
var rankingTime = $('#ranking-time');

/* 初期設定 */
var firstType = rankingType.val();
var firstTime = rankingTime.val();
setRankingType(firstType);
setRankingTime(firstTime);

function refreshRanking(liketype, liketime) {
    showLoading(liketype);

    $.ajax({
        type: 'POST',
        url: 'manga/get_ranking/' + liketype + '/' + liketime,
        cache: false,
        success: function (res) {
            var result = res.rslt;
            if (result > 0) {
                var noti_list = res.html_return;
                $('#ranking').html(noti_list).hide().fadeIn(400);
                rankingType.val(liketype);
                rankingTime.val(liketime);
            } else {
                customAlert(res.description);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {}
    });
}

function showLoading(liketype) {
    var color = '';
    switch (liketype) {
        case '0':
            color = '#3a98b4';
            break;
        case '1':
            color = '#edaa30';
            break;
        case '2':
            color = '#f4714b';
            break;
        case '3':
            color = '#39ad36';
            break;
        case '4':
            color = '#bf2896';
            break;
        default:
            color = 'rgba(75, 25, 26, 0.6)';
            break;
    }

    $('#ranking').html(
        '<p class="align-center"><i class="fas fa-spinner fa-spin fa-3x fa-fw"></i></p>'
    );
    $('#ranking .fa-spinner').css('color', color);
}

$('.ranking-type-item').click(function () {
    $('.ranking-type-item').removeClass('current-ranking');
    $(this).addClass('current-ranking');

    var liketype = $(this).attr('data-liketype');
    var liketime = rankingTime.val();

    setRankingType(liketype);

    var url = 'manga/get_ranking' + '/' + liketype + '/' + liketime;

    if (typeof ga !== 'undefined') {
        //ga('send', 'event', 'share', 'click', ranking_click);
        ga('send', 'pageview', url);
    }

    refreshRanking(liketype, liketime);
});

$('.ranking-time-item').click(function () {
    $('.ranking-time-item').removeClass('current-ranking-time');
    $(this).addClass('current-ranking-time');

    var liketime = $(this).attr('data-time');
    var liketype = rankingType.val();

    setRankingTime(liketime);

    var url = 'manga/get_rankingTime' + '/' + liketype + '/' + liketime;

    if (typeof ga !== 'undefined') {
        //ga('send', 'event', 'share', 'click', ranking_click);
        ga('send', 'pageview', url);
    }

    refreshRanking(liketype, liketime);
});

function setRankingType(rankingType) {
    var typeName = convertRankingType(rankingType);
    $('[data-id="ranking-type"]').text(typeName);
}

function setRankingTime(rankingTime) {
    var timeName = convertRankingTime(rankingTime);
    $('[data-id="ranking-time"]').text(timeName);
}

function convertRankingType(rankingType) {
    switch (rankingType) {
        case CONST_LIKE_STATUS_GOOD:
            return CONST_LIKE_NAME_GOOD;
        case CONST_LIKE_STATUS_ARUARU:
            return CONST_LIKE_NAME_ARUARU;
        case CONST_LIKE_STATUS_LAUGH:
            return CONST_LIKE_NAME_LAUGH;
        case CONST_LIKE_STATUS_JIIN:
            return CONST_LIKE_NAME_JIIN;
        case CONST_LIKE_STATUS_FUREFURE:
            return CONST_LIKE_NAME_FUREFURE;
        default:
            return '';
    }
}

function convertRankingTime(rankingTime) {
    switch (rankingTime) {
        case '0':
            return 'すべてのマンガ';
        case '1':
            return '最近のマンガ';
        default:
            return '';
    }
}
