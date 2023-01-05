/**
 * マイページ
 */
$(function () {
    var loading_screen = $('#loading');

    function close_another_form_account(current) {
        var form = $('#account form').not(current);
        form.each(function (index, value) {
            $(this).find('input, select, textarea').val($(this).find('.ori-val').val());

            $(this).find('input, select, textarea').attr('disabled', 'true');

            $(this).find('.btn-edit-save').hide();

            $(this).find('.btn-edit-cancel').hide();

            $(this).find('.btn-edit-save').hide();

            $(this).find('.btn-edit').show();
        });
    }

    // アカウントのロジック
    $('#account .btn-edit').click(function () {
        var form = $(this).parents('form');
        close_another_form_account(form);
        form.find('input, select, textarea').removeAttr('disabled');
        $(this).hide();
        form.find('.btn-edit-save').show();
        form.find('.btn-edit-cancel').show();
    });

    $('#account .btn-edit-save').click(function () {
        var form = $(this).parents('form');
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: new FormData(form[0]),
            cache: false,
            processData: false, // Ajaxがdataを整形しない指定
            contentType: false, // contentTypeもfalseに指定
            success: function (res) {
                var result = res.rslt;
                if (result > 0) {
                    customAlert(res.message_success, function () {
                        location.reload();
                    });
                } else {
                    customAlert(res.description);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest['responseText']);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    });

    $('#account .btn-edit-cancel').click(function () {
        var form = $(this).parents('form');
        form.find('input, select, textarea').val(form.find('.ori-val').val());
        form.find('input, select, textarea').attr('disabled', 'true');
        form.find('.btn-edit-save').hide();
        form.find('.btn-edit-cancel').hide();
        form.find('.btn-edit').show();
    });

    // アイコンの編集
    $('#edit-icon-file').on('change', function () {
        var form = $('#edit-icon-position-form');
        loading_screen.show();

        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: new FormData(form[0]),
            cache: false,
            // Ajaxがdataを整形しない指定
            processData: false,
            // contentTypeもfalseに指定
            contentType: false,
            success: function (res) {
                loading_screen.hide();

                var result = res.rslt;
                if (result > 0) {
                    window.location = edit_icon_url;
                } else {
                    customAlert(res.description);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                loading_screen.hide();
            }
        });
    });

    $(document).on('keypress', 'input:not(.allow_submit)', function (event) {
        return event.which !== 13;
    });
});
