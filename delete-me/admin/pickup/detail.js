$(function () {
    'use strict';

    /**
     * ピックアップ詳細画面
     * @type {Vue}
     */
    var vm = new Vue({
        el: '#pickup-manager-detail',
        mixins: [vueMixin],
        data: vueData,
        mounted() {
            this.getContents();

            // datetimepicker
            var self = this;
            $.datetimepicker.setLocale('ja');
            $('.js-begin-date, .js-end-date').datetimepicker({
                format: 'Y.m.d H:i',
                step: 30,
                disabledDates: this.disabledDates,
                formatDate: 'Y.m.d',
                onChangeDateTime: function (dp, $input) {
                    if ($input.hasClass('js-begin-date')) {
                        // 開始日
                        var inputBeginDate = $input.val();
                        self.beginDate = inputBeginDate;
                    } else {
                        // 終了日
                        var inputEndDate = $input.val();
                        self.endDate = inputEndDate;
                    }
                }
            });
        },
        methods: {
            /**
             * 表示コンテンツを取得する
             */
            getContents() {
                this.resetSelect();

                this.ajax(
                    {
                        url: 'admin/ad_pickup/get_contents_api',
                        type: CONST_HTTP_METHOD_GET,
                        data: {
                            category: this.contentsCategory,
                            limit: this.contentsLimit
                        },
                        success: function (res) {
                            // エラー
                            if (res.rslt == 0) {
                                un.danger(res.description);
                                return;
                            }

                            // 追加
                            var resItems = [];
                            res.data.forEach(function (item) {
                                if (this.selectItem.url == item.url) {
                                    this.selectItem = item;
                                    item.isSelect = true;
                                } else {
                                    item.isSelect = false;
                                }

                                resItems.push(item);
                            }, this);

                            this.items.length = 0;
                            this.items = this.sortContents(resItems);
                        }
                    },
                    this
                );
            },
            /**
             * 選択状態をリセットする
             */
            resetSelect() {
                this.items.forEach(function (item, index) {
                    this.items[index]['isSelect'] = false;
                }, this);
            },
            /**
             * コンテンツをソートする
             * @param {array} items
             * @return {array}
             */
            sortContents(items) {
                var sortedContents = [];
                if (this.contentsSort === CONST_SORT_ASC) {
                    sortedContents = items.sort(function (a, b) {
                        return a.date > b.date ? 1 : -1;
                    });
                } else if (this.contentsSort === CONST_SORT_DESC) {
                    sortedContents = items.sort(function (a, b) {
                        return a.date < b.date ? 1 : -1;
                    });
                }
                return sortedContents;
            },
            /**
             * ステータス名を取得する
             */
            getStateName(stateCode) {
                return this.pickupStates[stateCode];
            },
            /**
             * 確認ビュー前バリデーション
             * @return {boolean}
             */
            confirmValidation() {
                un.removeAll();

                var hasError = false;
                var error = false;

                // ex.) 2020.01.01 00:00
                var dateRegExp = new RegExp(
                    /^[0-9]{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]$/
                );

                error = validation.regexMatch(this.beginDate, dateRegExp);
                if (error) {
                    un.danger('"開始日" の形式が正しくありません。');
                    hasError = true;
                }

                error = validation.regexMatch(this.endDate, dateRegExp);
                if (error) {
                    un.danger('"終了日" の形式が正しくありません。');
                    hasError = true;
                }

                if (this.beginDate !== '' && this.endDate !== '') {
                    error = validation.notSame(this.beginDate, this.endDate);
                    if (error) {
                        un.danger('"開始日" と "終了日" が同一です。');
                        hasError = true;
                    }
                }

                error = validation.validPriod(this.beginDate, this.endDate);
                if (error) {
                    un.danger('"期間" の設定が正しくありません。');
                    hasError = true;
                }

                error = validation.validCode(this.pickupStateCode, 0, 1);
                if (error) {
                    un.danger('"ステータス" が正しくありません。');
                    hasError = true;
                }

                error = validation.required(this.selectItem.id);
                if (error) {
                    un.danger('"表示コンテンツ" が選択されていません。');
                    hasError = true;
                }

                if (this.selectItem.id && !this.selectItem.img_url) {
                    un.danger('"表示コンテンツ" にサムネイルが設定されていません。');
                    hasError = true;
                }

                return hasError;
            },
            /**
             * カテゴリセレクタチェンジイベント
             * @param {event} e
             */
            onChangeContentsCategory(e) {
                this.contentsCategory = e.target.value;
                this.getContents();
            },
            /**
             * 表示件数チェンジイベント
             * @param {event} e
             */
            onChangeContentsLimit(e) {
                this.getContents();
            },
            /**
             * ソートチェンジイベント
             * @param {event} e
             */
            onChangeContentsSort(e) {
                this.items = this.sortContents(this.items);
            },
            /**
             * 表示コンテンツクリックイベント
             * @param {event} e
             */
            onClickItem(e) {
                var $currentTarget = $(e.currentTarget);
                var selectIndex = $currentTarget.attr('data-index');

                if (!this.items[selectIndex]['img_url']) {
                    un.removeAll();
                    un.danger('サムネイルが設定されていないコンテンツです。', 2000);
                    return;
                }

                this.selectItem = this.items[selectIndex];

                this.resetSelect();
                this.items[selectIndex]['isSelect'] = true;
            },
            /**
             * 詳細アイコンクリックイベント
             * @param {event} e
             */
            onClickDetail(e) {
                e.preventDefault();

                var href = $(e.currentTarget).attr('href');
                var openUrl = location.origin + '/' + href;
                this.openNewWindow(openUrl, CONST_TABLET_BREAK_POINT);
            },
            /**
             * 確認ボタンクリックイベント
             * @param {event} e
             */
            onClickConfirm(e) {
                var hasError = this.confirmValidation();
                if (hasError) {
                    return;
                }

                confirmOverlayView.openView();
            },
            /**
             * 確認ビューキャンセルボタンクリックイベント
             * @param {event} e
             */
            onClickConfirmCancel(e) {
                confirmOverlayView.closeView();
            },
            /**
             * 確認ビューサブミットボタンクリックイベント
             * @param {event} e
             */
            onClickConfirmSubmit(e) {
                var method = this.pickup.pickup_id ? CONST_HTTP_METHOD_PUT : CONST_HTTP_METHOD_POST;

                this.ajax(
                    {
                        url: 'admin/ad_pickup/commit_api',
                        type: method,
                        data: {
                            pickup_id: this.pickup.pickup_id,
                            pickup_begin_date: this.beginDate.replace(/\./g, '/'),
                            pickup_end_date: this.endDate.replace(/\./g, '/'),
                            pickup_state_code: this.pickupStateCode,
                            select_item: this.selectItem
                        },
                        success: function (res) {
                            un.removeAll();

                            var title = '';
                            var description = '';
                            var backString = '';
                            var backUrl = '';
                            var self = this;

                            // エラー
                            if (res.rslt == 0) {
                                if (res.period_pickup) {
                                    $.each(res.period_pickup, function (index, item) {
                                        var description = res.description;
                                        description += '<br>';
                                        description +=
                                            '<a href="/admin/ad_pickup/edit/' +
                                            item.pickup_id +
                                            '" target="_blank">';
                                        description += self.escapeHTML(item.title);
                                        description += '</a>';
                                        un.danger(description);
                                    });
                                } else {
                                    un.danger(res.description);
                                }
                                return;
                            }

                            // 成功
                            switch (method) {
                                case CONST_HTTP_METHOD_PUT:
                                    title = '更新完了';
                                    description = 'ピックアップの更新が完了しました。';
                                    backString = 'ピックアップ一覧へ';
                                    backUrl = 'admin/ad_pickup';
                                    break;

                                case CONST_HTTP_METHOD_POST:
                                    title = '追加完了';
                                    description = 'ピックアップの追加が完了しました。';
                                    backString = 'ピックアップ一覧へ';
                                    backUrl = 'admin/ad_pickup';
                                    break;
                            }

                            // 完了画面へ
                            this.redirectPost('admin/ad_pickup/complete', {
                                title: title,
                                description: description,
                                backString: backString,
                                backUrl: backUrl
                            });
                        }
                    },
                    this
                );
            },
            /**
             * 削除ボタンクリックイベント
             * @param {event} e
             */
            onClickDelete(e) {
                if (!window.confirm(CONST_MSG_DELETE_CONFIRM)) {
                    return;
                }

                this.ajax(
                    {
                        url: 'admin/ad_pickup/commit_api',
                        type: CONST_HTTP_METHOD_DELETE,
                        data: {
                            pickup_id: this.pickup.pickup_id
                        },
                        success: function (res) {
                            // エラー
                            if (res.rslt == 0) {
                                un.danger(res.description);
                                return;
                            }

                            this.redirectPost('admin/ad_pickup/complete', {
                                title: '削除完了',
                                description: 'ピックアップの削除が完了しました。',
                                backString: 'ピックアップ一覧へ',
                                backUrl: 'admin/ad_pickup'
                            });
                        }
                    },
                    this
                );
            }
        }
    });
});
