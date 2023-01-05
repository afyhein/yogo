/**
 * ユーザー通知
 * @type {UserNotifications}
 */

var UserNotifications = (function () {
    /**
     * @constructor
     */
    function UserNotifications(params) {
        this.TYPE_SUCCESS = 'success';
        this.TYPE_DANGER = 'danger';
        this.TYPE_WARNING = 'warning';
        this.TYPE_INFO = 'info';

        this._container = null;
        this._props = {
            containerId: 'user-notifications',
            offsetBottom: '0px',
            offsetRight: '0px',
            itemWidth: '18rem'
        };

        this._items = [];

        this._overrideProps(params);
        this._initialize();
    }

    /**
     * プロパティを上書きする
     * @param {object} params
     */
    UserNotifications.prototype._overrideProps = function (params) {
        Object.keys(params).forEach(function (key) {
            this._props[key] = params[key];
        }, this);
    };

    /**
     * コンテナ初期化
     */
    UserNotifications.prototype._initialize = function () {
        var container = document.getElementById(this._props.containerId);
        if (container) {
            container.parentNode.removeChild(container);
        }

        this._container = document.createElement('div');
        this._container.setAttribute('id', this._props.containerId);
        this._container.classList.add('container');
        this._container.style.bottom = this._props.offsetBottom;
        this._container.style.right = this._props.offsetRight;
        document.body.appendChild(this._container);
    };

    /**
     * インデックスを更新する
     */
    UserNotifications.prototype._indexUpdate = function () {
        this._items.forEach(function (item, index) {
            item.setIndex(index);
        });
    };

    /**
     * 特定のアイテムを削除する
     * @param {int} index
     */
    UserNotifications.prototype.removeAt = function (index) {
        this._items[index].remove();
    };

    /**
     * すべてのアイテムを削除する
     */
    UserNotifications.prototype.removeAll = function () {
        var copyItem = this._items.slice(0, this._items.length);
        copyItem.forEach(function (item, _) {
            item.remove();
        });
    };

    /**
     * アイテムを追加する
     * @param {object} itemParams
     */
    UserNotifications.prototype.add = function (itemParams = {}) {
        itemParams.reomveCallback = function (index) {
            this._items.splice(index, 1);
            this._indexUpdate();
        }.bind(this);
        var item = new UserNotificationsItem(itemParams);

        this._items.push(item);
        item.setIndex(this._items.length - 1);
        this._container.appendChild(item.element);
    };

    /**
     * アイテム（緑）を追加する
     * @param {strins} text
     * @param {int} delay - 自動削除 (ms)
     */
    UserNotifications.prototype.success = function (text, delay = 0) {
        return this.add({
            type: this.TYPE_SUCCESS,
            text: text,
            delay: delay
        });
    };

    /**
     * アイテム（赤）を追加する
     * @param {strins} text
     * @param {int} delay - 自動削除 (ms)
     */
    UserNotifications.prototype.danger = function (text, delay = 0) {
        return this.add({
            type: this.TYPE_DANGER,
            text: text,
            delay: delay
        });
    };

    /**
     * アイテム（黄）を追加する
     * @param {strins} text
     * @param {int} delay - 自動削除 (ms)
     */
    UserNotifications.prototype.warning = function (text, delay = 0) {
        return this.add({
            type: this.TYPE_WARNING,
            text: text,
            delay: delay
        });
    };

    /**
     * アイテム（青）を追加する
     * @param {strins} text
     * @param {int} delay - 自動削除 (ms)
     */
    UserNotifications.prototype.info = function (text, delay = 0) {
        return this.add({
            type: this.TYPE_INFO,
            text: text,
            delay: delay
        });
    };

    return UserNotifications;
})();

/**
 * ユーザー通知アイテム
 * @type {UserNotificationsItem}
 */
var UserNotificationsItem = (function () {
    /**
     * @constructor
     */
    function UserNotificationsItem(params) {
        this.removeBtn = null;
        this.props = {
            type: 'nomal',
            text: '',
            delay: 0,
            reomveCallback: null
        };
        this.element = null;
        this._index = null;

        this._overrideProps(params);

        this._createItem();
        this._createRemoveBtn();

        this.delayRemove(this.props.delay);
    }

    /**
     * プロパティを上書きする
     * @param {object} params
     */
    UserNotificationsItem.prototype._overrideProps = function (params) {
        Object.keys(params).forEach(function (key) {
            this.props[key] = params[key];
        }, this);
    };

    /**
     * アイテムを作成する
     */
    UserNotificationsItem.prototype._createItem = function () {
        var item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = this.props.text;
        item.classList.add(this.props.type);
        this.element = item;
    };

    /**
     * 削除ボタンを作成する
     */
    UserNotificationsItem.prototype._createRemoveBtn = function () {
        var removeBtn = document.createElement('span');
        removeBtn.innerText = '×';
        removeBtn.classList.add('remove-btn');

        removeBtn.addEventListener(
            'click',
            function () {
                this.remove();
            }.bind(this)
        );

        this.element.appendChild(removeBtn);
        this.removeBtn = removeBtn;
    };

    /**
     * インデックスを設定する
     * @param {type} index
     */
    UserNotificationsItem.prototype.setIndex = function (index) {
        this._index = index;
    };

    /**
     * 自身を削除する
     */
    UserNotificationsItem.prototype.remove = function () {
        if (!this.element) {
            return;
        }

        var elm = this.element;
        elm.parentNode.removeChild(elm);
        this.element = null;

        if (typeof this.props.reomveCallback === 'function') {
            this.props.reomveCallback(this._index);
        }
    };

    /**
     * 遅延で自身を削除する
     * @param {int} delay
     */
    UserNotificationsItem.prototype.delayRemove = function (delay = 1000) {
        if (delay == 0) {
            return;
        }

        setTimeout(
            function () {
                this.remove();
            }.bind(this),
            delay
        );
    };

    return UserNotificationsItem;
})();
