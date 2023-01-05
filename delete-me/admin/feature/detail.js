$(function () {
    var vm = new Vue({
        el: '#feature-detail',
        mixins: [vueMixin],
        data: {
            useEndTimeCheck: useEndTimeCheck,
            dataDetail: dataDetail,
            medias: medias,
            selectedStatus: '-1',
            statusItems: statusItems
        },
        mounted() {
            var self = this;

            // 日付選択
            $.datetimepicker.setLocale('ja');
            $('.date_picker').datetimepicker({
                timepicker: true,
                format: 'Y.m.d H:i',
                step: 30,
                inline: false,
                onChangeDateTime: function (dp, input) {
                    // 公開日
                    if (input[0] == $('#begin_time')[0]) {
                        self.dataDetail.begin_time = input.val();
                    }

                    // 公開終了日
                    if (input[0] == $('#end_time')[0]) {
                        self.dataDetail.end_time = input.val();
                    }
                }
            });
        },
        methods: {
            /**
             * 削除ボンタンクリックイベント
             */
            onClickDelete() {
                customConfirm(CONST_MSG_DELETE_CONFIRM, function () {
                    window.location = FEATURE_DELETE_URL;
                });
            },
            /**
             * 画像変更イベント
             * @param {event} e
             */
            onChangeImgInput(e) {
                var self = this;
                var target = e.target.id;
                var fileName = this.getFileName(e.target.files[0].name);
                var image = e.target.files[0];
                if (!image) {
                    return;
                }

                var formData = new FormData();
                formData.append('image', image);
                formData.append('folder', 'contents');

                $.ajax('/admin/ad_media/img_upload', {
                    type: 'POST',
                    dataType: 'text',
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function (res) {
                    var response = JSON.parse(res);
                    var result = response.rslt;
                    var mediaId = response.media_id;
                    var mediaPath = response.media_path;
                    var mediaUrl = response.media_url;

                    // エラー
                    if (result == 0) {
                        alert(CONST_MSG_REGIST_IMG_ERROR);
                        return;
                    }

                    // メイン画像
                    if (target === 'js-main-img') {
                        self.medias.media_id = mediaId;
                        self.medias.media_url = mediaPath;
                        self.medias.media_full_url = mediaUrl;
                        if (self.medias.media_alt == '') {
                            self.medias.media_alt = fileName;
                        }
                    }

                    // サムネイル画像
                    if (target === 'js-thumb-img') {
                        self.medias.icon_media_id = mediaId;
                        self.medias.icon_media_url = mediaPath;
                        self.medias.icon_media_full_url = mediaUrl;
                        if (self.medias.icon_media_alt == '') {
                            self.medias.icon_media_alt = fileName;
                        }
                    }
                });
            },
            /**
             * サブミットイベント
             * @param {event} e
             */
            onSubmit(e) {
                e.preventDefault();

                if (!this.medias.icon_media_full_url) {
                    customConfirm(
                        'サムネイル画像が登録されていませんが、<br>よろしいですか？',
                        function () {
                            e.target.submit();
                        }
                    );
                } else {
                    e.target.submit();
                }
            }
        }
    });
});
