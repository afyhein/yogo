/* フィルターステータス */
var CONST_FILTER_STATUS_DRAFT = '下書き';
var CONST_FILTER_STATUS_PUBLIC = '公開';
var CONST_FILTER_STATUS_PUBLIC_RESERVE = '公開予約';
var CONST_FILTER_STATUS_PUBLIC_END = '公開終了';
var CONST_FILTER_STATUS_PUBLIC_RESERVE_DRAFT = '公開・公開予約・下書き';

/* ソート */
var CONST_SORT_ASC = '昇順';
var CONST_SORT_DESC = '降順';

/* フィルター */
var CONST_FILTER_ALL = 'all';
var CONST_FILTERS = [
    { label: '最新50件', value: 50 },
    { label: '最新100件', value: 100 },
    { label: '最新150件', value: 150 }
];
var CONST_FILTERS_WITH_ALL = [...CONST_FILTERS, { label: '全て', value: CONST_FILTER_ALL }];

/* ラベル */
var CONST_ACTION_LABEL_BACK = '戻る';
var CONST_ACTION_LABEL_CANCEL = 'キャンセル';
var CONST_ACTION_LABEL_ADD = '追加する';
var CONST_ACTION_LABEL_REGIST = '登録する';
var CONST_ACTION_LABEL_UPDATE = '更新する';
var CONST_ACTION_LABEL_DELETE = '削除する';
var CONST_ACTION_LABEL_CONFIRM = '確認する';
var CONST_ACTION_LABEL_SETTING = '設定する';

var CONST_LABEL_LIST = '一覧';
var CONST_LABEL_CONFIRM = '確認';
var CONST_LABEL_ADD = '追加';
var CONST_LABEL_EDIT = '編集';

/* ボタンラベル */
var CONST_LABEL_NO_SELECT = '選択なし';

/* メッセージ */
var CONST_MSG_NO_DATA = '結果がありません。';
var CONST_MSG_DELETE_CONFIRM = '本当に削除しますか？';
var CONST_MSG_COMMUNICATION_ERROR = '通信エラーが発生しました。';
var CONST_MSG_CHANGE_SORT_ERROR = '並び順の変更に失敗しました。';
var CONST_MSG_REGIST_IMG_ERROR = '画像の登録に失敗しました。';

var CONST_UNSETTING = '[ 未設定 ]';
