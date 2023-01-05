$(function () {
    'use strict';

    /**
     * ピックアップリスト画面
     * @type {Vue}
     */
    var vm = new Vue({
        el: '#recommend-goods-manager-list',
        mixins: [vueMixin],
        data: vueData,
        computed: {
            /**
             * フィルター後のリスト
             */
            filteredList() {
                return this.list.filter(function (item) {
                    switch (this.state) {
                        case CONST_FILTER_STATUS_PUBLIC_RESERVE_DRAFT:
                            return (
                                item.recommend_goods_state == CONST_FILTER_STATUS_PUBLIC ||
                                item.recommend_goods_state == CONST_FILTER_STATUS_PUBLIC_RESERVE ||
                                item.recommend_goods_state == CONST_FILTER_STATUS_DRAFT
                            );
                        case CONST_FILTER_STATUS_DRAFT:
                        case CONST_FILTER_STATUS_PUBLIC_END:
                        default:
                            return item.recommend_goods_state == this.state;
                    }
                }, this);
            },
            /**
             * ソート後のリスト
             */
            sortedList() {
                if (this.sort === CONST_SORT_ASC) {
                    return this.filteredList.sort(function (a, b) {
                        return a.recommend_goods_begin_date > b.recommend_goods_begin_date ? 1 : -1;
                    });
                } else if (this.sort === CONST_SORT_DESC) {
                    return this.filteredList.sort(function (a, b) {
                        return a.recommend_goods_begin_date < b.recommend_goods_begin_date ? 1 : -1;
                    });
                }
            }
        }
    });
});
