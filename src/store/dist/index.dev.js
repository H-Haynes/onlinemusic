"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vuex["default"]);

var _default = new _vuex["default"].Store({
  state: {
    uid: "",
    audioInfo: "",
    audioStatus: "paused",
    //当前音频状态
    currentTime: 0,
    duration: 0,
    showLogin: false,
    showSearchResult: false
  },
  mutations: {
    changeUid: function changeUid(state, uid) {
      state.uid = uid;
    },
    changeAudioInfo: function changeAudioInfo(state, info) {
      state.audioInfo = info;
    },
    changeCurrentTime: function changeCurrentTime(state, time) {
      state.currentTime = time;
    },
    changeDuration: function changeDuration(state, duration) {
      state.duration = duration;
    },
    changeAudioStatus: function changeAudioStatus(state, status) {
      state.audioStatus = status;
    },
    changeShowLogin: function changeShowLogin(state, isShow) {
      state.showLogin = isShow;
    },
    changeShowSearchResult: function changeShowSearchResult(state, isShow) {
      state.showSearchResult = isShow;
    }
  },
  actions: {
    changeUid: function changeUid(_ref, val) {
      var commit = _ref.commit;
      commit('changeUid', val);
    },
    changeAudioInfo: function changeAudioInfo(_ref2, info) {
      var commit = _ref2.commit;
      commit('changeAudioInfo', info);
    },
    changeShowLogin: function changeShowLogin(_ref3, isShow) {
      var commit = _ref3.commit;
      commit('changeShowLogin', isShow);
    },
    changeShowSearchResult: function changeShowSearchResult(_ref4, isShow) {
      var commit = _ref4.commit;
      commit("changeShowSearchResult", isShow);
    }
  },
  modules: {}
});

exports["default"] = _default;