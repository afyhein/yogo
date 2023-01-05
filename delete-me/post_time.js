/**
 * 投稿時間計算
 */
Date.prototype.toPastTimeSet = function () {
    var now = new Date();
    var nowserial = now.getTime();
    var serial = this.getTime();
    var past = nowserial - serial;
    if (past < 3600 * 1000) {
        // 一時間以内の場合
        var m = Math.floor(past / (60 * 1000));
        if (m <= 0) {
            return { state: 'now', inday: true, text: '今', class: 'today' };
        } else {
            return {
                state: 'minute',
                inday: true,
                text: m + '分前',
                class: 'today'
            };
        }
    } else if (past < 24 * 3600 * 1000) {
        // 一日以内の場合
        var h = Math.floor(past / (3600 * 1000));
        return {
            state: 'hour',
            inday: true,
            text: h + '時間前',
            class: 'today'
        };
    } else {
        var beforemonth = now.addMonths(-1);
        if (serial >= beforemonth.getTime()) {
            // 1ヶ月以内の場合
            var d = Math.floor(past / (24 * 3600 * 1000));
            return { state: 'day', inday: false, text: d + '日前', class: '' };
        }
    }

    var paramater = {
        jptime: true,
        showtime: false
    };
    return {
        state: 'date',
        inday: false,
        text: this.toStringEx(paramater),
        class: ''
    };
};

Date.prototype.addMonths = function (n) {
    var y = this.getFullYear();
    var m = this.getMonth();
    var d = this.getDate();
    var ay = Math.floor(n / 12);
    y += ay;
    m += n - ay * 12;
    if (m > 11) {
        m -= 12;
        y++;
    }

    var dt = new Date(y, m, 1);
    md = dt.getMonthLen();
    if (d > md) {
        d = md;
    }

    return new Date(y, m, d);
};

Date.prototype.getMonthLen = function () {
    var y = this.getFullYear();
    var m = this.getMonth() + 1;
    if (m > 11) {
        y++;
        m = 0;
    }
    var nd = new Date(y, m, 1).addDays(-1);
    return nd.getDate();
};

Date.prototype.addDays = function (n) {
    var dd = new Date(this.getTime() + 24 * 3600 * 1000 * n);
    return dd;
};

Date.prototype.toStringEx = function (param) {
    var para = {
        simple: false,
        showdate: true,
        showyear: true,
        showmonth: true,
        showday: true,
        showtime: true,
        showweek: false,
        jpdate: true,
        jptime: false,
        datediv: '/'
    };
    if (param) {
        $.extend(para, param);
    }
    var y = this.getFullYear();
    var m = this.getMonth() + 1;
    var d = this.getDate();
    var date = '';
    if (para.showdate) {
        if (para.showyear && (!para.simple || y !== new Date().getFullYear())) {
            if (para.jpdate) {
                date = y + '.';
            } else {
                date = y + para.datediv;
            }
        } else {
            date = '';
        }

        date += para.showmonth ? m + (para.jpdate ? '.' : para.datediv) : '';
        date += para.showday ? d + (para.jpdate ? '' : '') : '';
        date += para.showweek ? '(' + this.getWeekText() + ')' : '';
    }

    if (para.showtime) {
        var min = this.getMinutes();
        date +=
            (date !== '' ? ' ' : '') +
            this.getHours() +
            (para.jptime ? '時' : ':') +
            (min < 10 ? '0' + min : min) +
            (para.jptime ? '分' : '');
        // date+=" "+this.getHours()+":"+min;
    }

    return date;
};

DateCommon = {
    parse: function (s) {
        var m = s.match(
            /^(\d{4})[-/_.:](\d{1,2})[-/_.:](\d{1,2})(\s+(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/
        );
        if (m) {
            if (m[5]) {
                var ss = m[8] ? Number(m[8]) : 0;
                return new Date(
                    Number(m[1]),
                    Number(m[2]) - 1,
                    Number(m[3]),
                    Number(m[5]),
                    Number(m[6]),
                    ss
                );
            } else {
                return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
            }
        }
        return null;
    }
};

function pastTimeRefresh(panel) {
    var tgt = panel ? $(panel).find('.timecheck') : $('.timecheck');
    tgt.each(function () {
        var dts = $(this).attr('datetime');
        if (dts) {
            var dt = DateCommon.parse(dts);
            if (dt) {
                var timeset = dt.toPastTimeSet();
                $(this).text(timeset.text).addClass(timeset.class);
                return true;
            }
        }

        $(this).removeClass('timecheck');
    });
}
