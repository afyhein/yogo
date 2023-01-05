$(function () {
    $.datetimepicker.setLocale('ja');

    $('.enquete-posting-date').datetimepicker({
        format: 'Y.m.d',
        step: 30,
        inline: false,
        timepicker: false,
        scrollMonth: false,
        scrollInput: false
    });

    $('.enquete-release-date').datetimepicker({
        format: 'Y.m.d H:i',
        step: 30,
        inline: false,
        timepicker: true,
        scrollMonth: false,
        scrollInput: false
    });

    $('.enquete-sec-num1, .enquete-sec-num2').on('input', function () {
        var num1 = $('.enquete-sec-num1').val();
        var num2 = $('.enquete-sec-num2').val();

        num1 = num1 === '' ? 0 : num1;
        num2 = num2 === '' ? 0 : num2;

        var result = parseInt(num1) + parseInt(num2);

        $('.total-num').val(result);
    });

    FileApi('#enquete_img_url', '#enquete_img_result');
});
