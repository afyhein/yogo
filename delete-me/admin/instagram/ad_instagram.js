$(function () {
    $.datetimepicker.setLocale('ja');

    $('.insta-publish-date').datetimepicker({
        format: 'Y.m.d H:i',
        step: 30,
        inline: false,
        timepicker: true,
        scrollMonth: false,
        scrollInput: false
    });

    $('.insta-end-date').datetimepicker({
        format: 'Y.m.d H:i',
        step: 30,
        inline: false,
        timepicker: true,
        scrollMonth: false,
        scrollInput: false
    });

    $('#insta-form').click(function() {
        let insta_tag = $('.insta-tag').val();
        if(insta_tag == '') {
            alert('Instagram Tag cannot be empty');
            return false;
        }

        let pub_date = $('.insta-publish-date').val();
        let end_date = $('.insta-end-date').val();

        if(pub_date == '' || end_date == '') {
            alert('Duration date cannot be empty');
            return false;
        }

        pub_date = pub_date.replace(/\./g,'-');
        let pub_date_ts = new Date(pub_date);
        pub_date_ts = pub_date_ts.getTime();

        
        end_date = end_date.replace(/\./g,'-');
        let end_date_ts = new Date(end_date);
        end_date_ts = end_date_ts.getTime();

        if(pub_date_ts >= end_date_ts) {
            alert('End date should be after publish date');
            return false;
        }else{
            return true;
        }
      });
});
