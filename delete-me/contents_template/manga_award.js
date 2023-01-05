//マンガ大賞詳細

$(function () {
    $('#manga-award-index > li').click(function () {
        var currentUrl = 'https://' + location.host + location.pathname;
        var idSelector = $(this).attr('data-id');
        location.href = currentUrl + '#' + idSelector;
    });
});
