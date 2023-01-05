$(function () {
    /**
     * カレンダー
     */
    var CALENDAR_API_URL = 'admin/ad_slider/calendar_api';
    var year = 0;
    var month = 0;
    var date = 0;
    var begin = new Date();

    // 初期値セット
    updateCalendar();

    // イベントセット
    $('button[name="calendar"]').on('click', function () {
        setBeginDate(this);
        updateCalendar();
    });

    function setBeginDate(obj) {
        var SHOW_DAYS = 15;
        var beginYear = begin.getFullYear();
        var beginMonth = begin.getMonth();
        var beginDate = begin.getDate();
        var direction = $(obj).attr('data-id');
        switch (direction) {
            case 'back':
                beginDate -= SHOW_DAYS;
                break;
            case 'next':
                beginDate += SHOW_DAYS;
                break;
            default:
                var today = new Date();
                var thisYear = today.getFullYear();
                var thisMonth = today.getMonth();
                var thisDate = today.getDate();
                beginYear = thisYear;
                beginMonth = thisMonth;
                beginDate = thisDate;
        }
        var begin_date = new Date(beginYear, beginMonth, beginDate);
        year = begin_date.getFullYear();
        month = begin_date.getMonth() + 1;
        date = begin_date.getDate();
    }

    function updateCalendar() {
        $.ajax({
            url: CALENDAR_API_URL + '/' + SLIDER_PAGE_CODE + '/' + year + '/' + month + '/' + date,
            type: 'GET'
        })
            .done(function (response) {
                // 成功
                begin = new Date(response.search_begin);
                setBeginDate();
                setData(response);
            })
            .fail(function (data) {
                // 失敗
                alert('更新に失敗しました。');
            });
    }

    function setData(response) {
        // リセット
        $('.stretch-container tr').empty();

        var duplication = '';
        var setCalendarMonth = '';

        var today = new Date();
        var thisYear = today.getFullYear();
        var thisMonth = today.getMonth() + 1;
        var thisDate = today.getDate();
        var strToday = thisYear + '/' + thisMonth + '/' + thisDate;

        var outputDate = '';
        var outputCount = '';

        $.each(response.date_datas, function (_, data) {
            var dateData = new Date(data.date);
            var itemYear = dateData.getFullYear();
            var itemMonth = dateData.getMonth() + 1;
            var itemDate = dateData.getDate();
            var itemDay = dateData.getDay();

            // 年・月重複チェック
            var setYearMonth = itemYear + '<br>' + itemMonth + '月';
            if (setYearMonth === duplication) {
                setYearMonth = '';
            } else {
                duplication = setYearMonth;
            }

            setCalendarMonth += '<td>' + setYearMonth + '</td>';

            var dateTd = $('<td></td>');
            var countTd = $('<td></td>');

            // 土日
            var holidayClass = itemDay === 0 || itemDay === 6 ? 'holiday' : '';
            dateTd.addClass(holidayClass);

            // バナーの有無
            var bannerNonClass = data.has_no_set_time ? 'banner_non' : '';
            dateTd.addClass(bannerNonClass);
            countTd.addClass(bannerNonClass);

            // 今日の判断
            var biginDate = itemYear + '/' + itemMonth + '/' + itemDate;
            var todayClass = biginDate === strToday ? 'today' : '';
            dateTd.addClass(todayClass);
            countTd.addClass(todayClass);

            // 0件の場合
            var bannerNum = data.count === 0 ? '' : data.count;
            dateTd = dateTd.text(itemDate);
            countTd = countTd.text(bannerNum);

            outputDate += dateTd.prop('outerHTML');
            outputCount += countTd.prop('outerHTML');
        });

        // 追加
        $('.calendar-month').append(setCalendarMonth);
        $('.calendar-date').append(outputDate);
        $('.calendar-count').append(outputCount);
        // 月初め
        $('.calendar-month td:parent').addClass('first-day');
    }
});
