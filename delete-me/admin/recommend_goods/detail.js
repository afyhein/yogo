$(function () {
    'use strict';

    /**
     * おすすめ商品追加ビュー
     * @type {OverlayView}
     */
    var selectItemOverlayView = new OverlayView({
        target: 'select-item',
        showScrollArrow: true,
        scrollArrowPosition: 'center',
        scrollArrowOffset: { x: '0rem', y: '4.2rem' },
        openCallback: function () {
            fotterButtonsArea.hide();
        },
        closeCallback: function () {
            fotterButtonsArea.show();
        }
    });

    /**
     * おすすめ育児グッズ詳細画面
     * @type {Vue}
     */
    var vm = new Vue({
        el: '#recommend-goods-manager-detail',
        mixins: [vueMixin],
        data: vueData,
        mounted() {
            // 終了日設定の判定
            this.useEndDate = !!this.endDate;

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
        watch: {
            /**
             * 終了日設定フラグ
             * @param {boolean} newVal
             */
            useEndDate(newVal) {
                // 設定する
                if (newVal && !this.endDate) {
                    this.endDate = this.formatDate(this.beginDate, 'YYYY.MM.DD 23:59');
                }

                // 設定しない
                if (!newVal) {
                    this.endDate = '';
                }
            }
        },
        computed: {
            /**
             * 開始日
             */
            beginDate: {
                get() {
                    // 手動編集のため初回のみフォーマットをかける
                    return this.fmtFullDateOnly(this.parent.recommend_goods_begin_date);
                },
                set(date) {
                    this.parent.recommend_goods_begin_date = date;
                }
            },
            /**
             * 終了日
             */
            endDate: {
                get() {
                    // 手動編集のため初回のみフォーマットをかける
                    return this.fmtFullDateOnly(this.parent.recommend_goods_end_date);
                },
                set(date) {
                    this.parent.recommend_goods_end_date = date;
                }
            },
            /**
             * ソート後の子リスト
             * @return {array}
             */
            sortedChildrenList() {
                // 昇順
                return this.children.sort(function (a, b) {
                    return a.sort_index > b.sort_index ? 1 : -1;
                });
            },
            /**
             * 有効なユーザー
             * @return {array}
             */
            validUsers() {
                return this.users.filter(function (user) {
                    return user.user_state_code == 0;
                });
            },
            /**
             * ソート後のおすすめ商品
             * @return {array}
             */
            sortedAffiliates() {
                if (this.affiliate.sort === CONST_SORT_ASC) {
                    return this.affiliate.items.sort(function (a, b) {
                        return a.affiliate_date > b.affiliate_date ? 1 : -1;
                    });
                } else if (this.affiliate.sort === CONST_SORT_DESC) {
                    return this.affiliate.items.sort(function (a, b) {
                        return a.affiliate_date < b.affiliate_date ? 1 : -1;
                    });
                }
            },
            /**
             * 有効なおすすめ商品
             * @return {array}
             */
            validAffiliates() {
                return this.sortedAffiliates.filter(function (affiliate) {
                    return affiliate.affiliate_state_code == 1;
                });
            },
            /**
             * リミット後のおすすめ商品
             * @return {array}
             */
            limitedAffiliates() {
                var limit =
                    this.affiliate.limit === CONST_FILTER_ALL
                        ? this.validAffiliates.length
                        : this.affiliate.limit;
                return this.validAffiliates.slice(0, limit);
            },
            /**
             * フィルター後のおすすめ商品
             * @return {array}
             */
            filteredAffiliates() {
                var searchText = this.affiliate.searchText;
                var regExp = new RegExp(searchText.toLowerCase());
                return this.limitedAffiliates.filter(function (affiliate) {
                    var title = affiliate.affiliate_title;
                    return title.toLowerCase().match(regExp);
                });
            }
        },
        methods: {
            /**
             * 上ボタンクリックイベント
             * @param {number} index
             */
            up(index) {
                if (index <= 0) {
                    return;
                }

                this.children[index - 1].sort_index = index;
                this.children[index].sort_index = index - 1;
            },
            /**
             * 下ボタンクリックイベント
             * @param {number} index
             */
            down(index) {
                if (index >= this.children.length - 1) {
                    return;
                }

                this.children[index].sort_index = index + 1;
                this.children[index + 1].sort_index = index;
            },
            /**
             * おすすめ商品追加ボタンクリックイベント
             * @param {number} index
             */
            onClickSelectItem(index) {
                un.removeAll();

                if (index < 0) {
                    // 追加
                    this.editingChild = {
                        affiliate_recommend_goods_id: null,
                        affiliate_recommend_goods_comment: null,
                        sort_index: null,
                        user_id: null,
                        affiliate_id: null,
                        mode: 'add'
                    };
                } else {
                    // 編集
                    var clone = JSON.parse(JSON.stringify(this.sortedChildrenList[index]));
                    this.editingChild = clone;
                    this.editingChild.mode = 'edit';
                }

                this.editingChild.index = index;
                this.affiliate.searchText = '';
                selectItemOverlayView.openView();
            },
            /**
             * おすすめ商品削除ボタンクリックイベント
             * @param {event} e
             */
            onClickSelectItemDelete(e) {
                customConfirm(
                    CONST_MSG_DELETE_CONFIRM,
                    function () {
                        var editingIndex = this.editingChild.index;
                        this.children = this.sortedChildrenList.filter(function (_, index) {
                            return index !== editingIndex;
                        });

                        this.onClickSelectItemCancel(e);
                    }.bind(this)
                );
            },
            /**
             * おすすめ商品追加サブミットボタンクリックイベント
             * @param {event} e
             */
            onClickSelectItemSubmit(e) {
                var hasError = this.selectItemValidation();
                if (hasError) {
                    return;
                }

                var mode = this.editingChild.mode;
                var comment = this.editingChild.affiliate_recommend_goods_comment;
                var userId = this.editingChild.user_id;
                var affiliateId = this.editingChild.affiliate_id;

                switch (mode) {
                    case 'add': // 追加
                        this.children.push({
                            affiliate_recommend_goods_id: null,
                            affiliate_recommend_goods_comment: comment,
                            sort_index: this.children.length,
                            user_id: userId,
                            affiliate_id: affiliateId
                        });
                        break;

                    case 'edit': // 編集
                        var index = this.editingChild.index;
                        this.children[index].affiliate_recommend_goods_comment = comment;
                        this.children[index].user_id = userId;
                        this.children[index].affiliate_id = affiliateId;
                        break;
                }

                this.onClickSelectItemCancel(e);
            },
            /**
             * おすすめ商品の検索文字入力イベント
             * @param {event} e
             */
            onInputSearchText(e) {
                var searchText = this.affiliate.searchText;
                var maxValue = CONST_FILTER_ALL;
                var minValue = CONST_FILTERS_WITH_ALL[0].value;
                this.affiliate.limit = searchText ? maxValue : minValue;
            },
            /**
             * おすすめ商品追加前バリデーション
             * @return {boolean}
             */
            selectItemValidation() {
                un.removeAll();

                var hasError = false;
                var error = false;
                var userId = this.editingChild.user_id;
                var comment = this.editingChild.affiliate_recommend_goods_comment;
                var affiliateId = this.editingChild.affiliate_id;

                error = validation.required(userId);
                if (error) {
                    un.danger('"スタッフ" が選択されていません。');
                    hasError = true;
                }

                error = validation.required(comment);
                if (error) {
                    un.danger('"コメント" が入力されていません。');
                    hasError = true;
                }

                error = validation.maxLength(comment, this.COMMENT_MAX_LENGTH);
                if (error) {
                    un.danger('"コメント" が' + this.COMMENT_MAX_LENGTH + '文字を超えています。');
                    hasError = true;
                }

                error = validation.required(affiliateId);
                if (error) {
                    un.danger('"おすすめ商品" が選択されていません。');
                    hasError = true;
                }

                return hasError;
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
             * 確認ビュー前バリデーション
             * @return {boolean}
             */
            confirmValidation() {
                un.removeAll();

                var hasError = false;
                var error = false;
                var title = this.parent.recommend_goods_title;
                var subTitle = this.parent.recommend_goods_sub_title;
                var stateCode = this.parent.recommend_goods_state_code;

                error = validation.required(title.trim());
                if (error) {
                    un.danger('"タイトル" が入力されていません。');
                    hasError = true;
                }

                error = validation.maxLength(title, this.TITLE_MAX_LENGTH);
                if (error) {
                    un.danger('"タイトル" が' + this.TITLE_MAX_LENGTH + '文字を超えています。');
                    hasError = true;
                }

                error = validation.required(subTitle.trim());
                if (error) {
                    un.danger('"サブタイトル" が入力されていません。');
                    hasError = true;
                }

                error = validation.maxLength(subTitle, this.SUB_TITLE_MAX_LENGTH);
                if (error) {
                    un.danger(
                        '"サブタイトル" が' + this.SUB_TITLE_MAX_LENGTH + '文字を超えています。'
                    );
                    hasError = true;
                }

                // ex.) 2020.01.01 00:00
                var dateRegExp = new RegExp(
                    /^[0-9]{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]$/
                );

                error = validation.regexMatch(this.beginDate, dateRegExp);
                if (error) {
                    un.danger('"開始日" の形式が正しくありません。');
                    hasError = true;
                }

                // 終了日設定時
                if (this.useEndDate) {
                    error = validation.regexMatch(this.endDate, dateRegExp);
                    if (error) {
                        un.danger('"終了日" の形式が正しくありません。');
                        hasError = true;
                    }

                    error = validation.validPriod(this.beginDate, this.endDate);
                    if (error) {
                        un.danger('"期間" の設定が正しくありません。');
                        hasError = true;
                    }
                }

                if (this.beginDate !== '') {
                    error = validation.notSame(this.beginDate, this.endDate);
                    if (error) {
                        un.danger('"開始日" と "終了日" が同一です。');
                        hasError = true;
                    }
                }

                error = validation.validCode(stateCode, 0, 1);
                if (error) {
                    un.danger('"ステータス" が正しくありません。');
                    hasError = true;
                }

                // 以下、公開ステータス時
                if (stateCode == 0) {
                    return hasError;
                }

                error = validation.required(this.children.length);
                if (error) {
                    un.danger('"おすすめ商品" が選択されていません。');
                    hasError = true;
                }

                return hasError;
            },
            /**
             * 削除ボタンクリックイベント
             * @param {event} e
             */
            onClickDelete(e) {
                customConfirm(
                    CONST_MSG_DELETE_CONFIRM,
                    function () {
                        this.ajax(
                            {
                                url: 'admin/ad_recommend_goods/commit_api',
                                type: CONST_HTTP_METHOD_DELETE,
                                data: {
                                    parent: this.parent
                                },
                                success: function (res) {
                                    // エラー
                                    if (res.rslt == 0) {
                                        un.danger(res.description);
                                        return;
                                    }

                                    this.redirectPost('admin/ad_recommend_goods/complete', {
                                        title: '削除完了',
                                        description: 'おすすめ育児グッズの削除が完了しました。',
                                        backString: 'おすすめ育児グッズ一覧へ',
                                        backUrl: 'admin/ad_recommend_goods'
                                    });
                                }
                            },
                            this
                        );
                    }.bind(this)
                );
            },
            /**
             * おすすめ商品ビューキャンセルボタンクリックイベント
             * @param {event} e
             */
            onClickSelectItemCancel(e) {
                // リセット
                this.editingChild = {};
                un.removeAll();

                selectItemOverlayView.closeView();
            },
            /**
             * 確認ビューキャンセルボタンクリックイベント
             * @param {event} e
             */
            onClickConfirmCancel(e) {
                confirmOverlayView.closeView();
            },
            /**
             * サブミットボタンクリックイベント
             * @param {event} e
             */
            onClickSubmit(e) {
                var method = this.parent.recommend_goods_id
                    ? CONST_HTTP_METHOD_PUT
                    : CONST_HTTP_METHOD_POST;

                this.parent.recommend_goods_begin_date = this.beginDate;
                this.parent.recommend_goods_end_date = this.endDate;

                this.ajax(
                    {
                        url: 'admin/ad_recommend_goods/commit_api',
                        type: method,
                        data: {
                            parent: this.parent,
                            children: this.children
                        },
                        success: function (res) {
                            un.removeAll();

                            var postData = {
                                title: '',
                                description: '',
                                backString: 'おすすめ育児グッズ一覧へ',
                                backUrl: 'admin/ad_recommend_goods'
                            };

                            switch (method) {
                                case CONST_HTTP_METHOD_PUT:
                                    postData.title = '更新完了';
                                    postData.description =
                                        'おすすめ育児グッズの更新が完了しました。';
                                    break;

                                case CONST_HTTP_METHOD_POST:
                                    postData.title = '追加完了';
                                    postData.description =
                                        'おすすめ育児グッズの追加が完了しました。';
                                    break;
                            }

                            // 完了画面へ
                            this.redirectPost('admin/ad_recommend_goods/complete', postData);
                        }
                    },
                    this
                );
            },
            /**
             * おすすめ商品リストのクリックイベント
             * @param {event} e
             */
            onClickAffiliateItem(e) {
                var affiliateId = e.currentTarget.dataset.affiliateId;
                this.editingChild.affiliate_id = affiliateId;
            },
            /**
             * ユーザーIDからユーザー名を取得する
             * @param {number} userId
             */
            getUserName(userId) {
                var user = this.users.find(function (uesr) {
                    return uesr.user_id == userId;
                });
                return user.user_nickname;
            },
            /**
             * アフェリエイトIDからタイトルを取得する
             * @param {number} affiliateId
             */
            getAffiliateTitle(affiliateId) {
                var affiliate = this.findAffiliate(affiliateId);
                return affiliate.affiliate_title;
            },
            /**
             * アフェリエイトIDから画像URLを取得する
             * @param {number} affiliateId
             */
            getAffiliateImgUrl(affiliateId) {
                var affiliate = this.findAffiliate(affiliateId);
                return this.createS3ImgUrl(affiliate.affiliate_img_url);
            },
            /**
             * アフィリエイトIDから対象を探す
             * @param {number} affiliateId
             */
            findAffiliate(affiliateId) {
                if (!affiliateId) {
                    return {};
                }

                return this.affiliate.items.find(function (affiliate) {
                    return affiliate.affiliate_id == affiliateId;
                });
            },
            /**
             * ステータスコードからステータス名を取得する
             * @param {number} stateCode
             */
            getStateName(stateCode) {
                return this.RECOMMEND_GOODS_STATES[stateCode];
            }
        }
    });
});
