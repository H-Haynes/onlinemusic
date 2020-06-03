"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _index = _interopRequireDefault(require("@/router/index"));

var _index2 = _interopRequireDefault(require("@/store/index"));

require("@/components/toast/index.js");

require("view-design/dist/styles/iview.css");

require("@/assets/css/common.css");

var _vueLazyload = _interopRequireDefault(require("vue-lazyload"));

var _elementUi = require("element-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].config.productionTip = false;
_vue["default"].prototype.bus = new _vue["default"]();

_vue["default"].use(_vueLazyload["default"]);

_vue["default"].use(_elementUi.Table);

_vue["default"].use(_elementUi.TableColumn);

_vue["default"].use(_elementUi.Loading);

_vue["default"].use(_elementUi.Input);

_vue["default"].filter('fixedNum', function (val) {
  if (val < 10000) {
    return val;
  } else if (val < 1000000) {
    return (val / 10000).toFixed(1) + '万';
  } else if (val < 100000000) {
    return Math.ceil(val / 10000) + '万';
  } else {
    return (val / 100000000).toFixed(1) + '亿';
  }
});

_vue["default"].filter("duration", function (val) {
  var min = Math.floor(val / 60000);
  var sec = Math.ceil(val % 60000 / 6000);

  function addZero(val) {
    return val > 9 ? val : '0' + val;
  }

  return addZero(min) + ":" + addZero(sec);
});

_vue["default"].filter('toDateStrZH', function (val) {
  if (!val) {
    return '-';
  }

  var time = new Date(val);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  return year + '年' + month + '月' + day + '日';
});

_vue["default"].filter('toTimeStrZH', function (val) {
  if (!val) {
    return '-';
  }

  var time = new Date(val);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();

  function addZero(num) {
    return num > 9 ? num : '0' + num;
  }

  return year + '年' + month + '月' + day + '日 ' + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
});

_vue["default"].filter('toTimeStr', function (val) {
  if (!val) {
    return '-';
  }

  var time = new Date(val);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();

  function addZero(num) {
    return num > 9 ? num : '0' + num;
  }

  return year + '-' + addZero(month) + '-' + addZero(day) + ' ' + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
});

new _vue["default"]({
  router: _index["default"],
  store: _index2["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');