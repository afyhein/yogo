var Strlen = new (function () {
    this.setup = function (inputName, maxLength) {
        $('[name="' + inputName + '"]').each(function () {
            $(this).bind('input', onInput(this, maxLength));
            $(this)
                .parent()
                .next('dd')
                .html(getString($(this).val().length, maxLength));
        });
    };

    function onInput(elm, maxLength) {
        var v,
            old = elm.value;

        return function () {
            if (old != (v = elm.value)) {
                old = v;
                $(this)
                    .parent()
                    .next('dd')
                    .html(getString($(this).val().length, maxLength));
            }
        };
    }

    function getString(num, max) {
        return '残り' + (max - num) + '文字';
    }
})();
