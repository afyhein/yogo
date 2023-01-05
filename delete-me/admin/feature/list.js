$(function () {
    /**
     * Vue component
     */
    Vue.component('feature-items', {
        mixins: [vueMixin],
        props: ['item', 'items', 'index', 'selected_status'],
        template: FEATURE_ITEMS_TEMPLATE,
        methods: {
            /**
             * 上ボタンクリックイベント
             * @param {number} index
             */
            up(index) {
                if (index == 0) {
                    return;
                }

                this.items.splice(index - 1, 2, this.items[index], this.items[index - 1]);
                this.updateOrder();
            },
            /**
             * 下ボタンクリックイベント
             * @param {number} index
             */
            down(index) {
                if (index == this.items.length - 1) {
                    return;
                }

                this.items.splice(index, 2, this.items[index + 1], this.items[index]);
                this.updateOrder();
            },
            /**
             * 並び順を登録する
             */
            updateOrder() {
                var myJsonString = JSON.stringify(this.items);

                var fd = new FormData();
                fd.append('order_data', myJsonString);

                $.ajax('/admin/ad_feature/order_update_api', {
                    type: 'POST',
                    dataType: 'text',
                    data: fd,
                    processData: false,
                    contentType: false
                }).done(function (result) {
                    resultJson = JSON.parse(result);
                    if (resultJson.rslt == 0) {
                        alert(CONST_MSG_CHANGE_SORT_ERROR);
                    }
                });
            }
        }
    });

    /**
     * Vue instance
     * @type {Vue}
     */
    var vm = new Vue({
        el: '#feature-list',
        mixins: [vueMixin],
        data: {
            items: featureItems,
            items_orgin: featureItems,
            statusItems: statusItems,
            selectedStatus: '1' // 初期値 [公開]
        },
        created() {
            this.filterItem(this.selectedStatus);
        },
        watch: {
            selectedStatus() {
                if (this.selectedStatus.length > 0) {
                    if (this.selectedStatus >= 0) {
                        // ！全て
                        this.filterItem(this.selectedStatus);
                    } else {
                        // 全て
                        this.items = this.items_orgin;
                    }
                }
            }
        },
        methods: {
            filterItem(selected) {
                var now = new Date();

                switch (selected) {
                    case '0': // 下書き
                        this.items = this.items_orgin.filter(function (item) {
                            return item.feature_state_code === selected;
                        });
                        break;

                    case '1': // 公開・公開予約・下書き
                        this.items = this.items_orgin.filter(function (item) {
                            if (item.feature_state_code === '0') {
                                return true; // 下書きは無条件に検索対象
                            }
                            var endTime = new Date(item.end_time);
                            var containsEndTime = item.end_time === '' || endTime >= now;
                            return item.feature_state_code === '1' && containsEndTime;
                        });
                        break;

                    case '3': // 公開終了
                        this.items = this.items_orgin.filter(function (item) {
                            var endTime = new Date(item.end_time);
                            return item.feature_state_code === '1' && endTime < now;
                        });
                        break;
                }
            }
        }
    });
});
