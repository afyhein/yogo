$(function () {
    'use strict';

    /**
     * ピックアップリスト画面
     * @type {Vue}
     */
    var vm = new Vue({
        el: '#pickup-manager-list',
        mixins: [vueMixin],
        data: vueData,
        computed: {
            filteredList() {
                return this.list.filter(function (item) {
                    switch (this.state) {
                        case CONST_FILTER_STATUS_PUBLIC_RESERVE_DRAFT:
                            return (
                                item.pickup_state == CONST_FILTER_STATUS_PUBLIC ||
                                item.pickup_state == CONST_FILTER_STATUS_PUBLIC_RESERVE ||
                                item.pickup_state == CONST_FILTER_STATUS_DRAFT
                            );
                        case CONST_FILTER_STATUS_DRAFT:
                        case CONST_FILTER_STATUS_PUBLIC_END:
                        default:
                            return item.pickup_state == this.state;
                    }
                }, this);
            },
            sortedList() {
                if (this.sort === CONST_SORT_ASC) {
                    return this.filteredList.sort(function (a, b) {
                        return a.begin_date > b.begin_date ? 1 : -1;
                    });
                } else if (this.sort === CONST_SORT_DESC) {
                    return this.filteredList.sort(function (a, b) {
                        return a.begin_date < b.begin_date ? 1 : -1;
                    });
                }
            }
        }
    });
});
