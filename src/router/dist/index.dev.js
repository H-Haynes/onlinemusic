"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Home = _interopRequireDefault(require("../views/main/Home.vue"));

var _recommend = _interopRequireDefault(require("@/views/main/findMusic/recommend.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  name: 'home',
  component: _Home["default"],
  redirect: "/find"
}, {
  path: '/find',
  name: 'find',
  redirect: "/find/recommend",
  component: _Home["default"],
  children: [{
    name: "recommend",
    path: "recommend",
    component: _recommend["default"]
  }, {
    name: "playlist",
    path: "playlist",
    component: function component(resolve) {
      return require(["@/views/main/findMusic/playlist/playlist.vue"], resolve);
    }
  }, {
    name: "anchor",
    path: "anchor",
    component: function component(resolve) {
      return require(["@/views/main/findMusic/anchor/anchor.vue"], resolve);
    }
  }, {
    name: "rank",
    path: "rank",
    component: function component(resolve) {
      return require(['@/views/main/findMusic/rank/rank.vue'], resolve);
    }
  }, {
    name: "artists",
    path: "artists",
    component: function component(resolve) {
      return require(["@/views/main/findMusic/artists/artists.vue"], resolve);
    }
  }, {
    name: "new",
    path: "new",
    component: function component(resolve) {
      return require(["@/views/main/findMusic/new/new.vue"], resolve);
    }
  }]
}, {
  name: 'rankdetail',
  path: "/rankdetail/:idx",
  props: true,
  component: function component(resolve) {
    return require(["@/views/main/findMusic/rank/rankDetail.vue"], resolve);
  }
}, {
  name: 'radio',
  path: '/radio/:radio_id',
  props: true,
  component: function component(resolve) {
    return require(["@/views/main/radio.vue"], resolve);
  }
}, {
  name: 'list',
  path: '/list/:list_id',
  props: true,
  component: function component(resolve) {
    return require(["@/views/main/list.vue"], resolve);
  }
}, {
  name: 'art',
  path: '/art/:art_id',
  props: true,
  component: function component(resolve) {
    return require(["@/views/main/artist.vue"], resolve);
  }
}, {
  name: 'fm',
  path: "/fm",
  component: function component(resolve) {
    return require(['@/views/main/fm/fm.vue'], resolve);
  }
}, {
  path: '/about',
  name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/main/About.vue'));
    });
  }
}, {
  path: "/videolist",
  name: "videolist",
  component: function component(resolve) {
    return require(["@/views/main/video/index.vue"], resolve);
  },
  redirect: "/videolist/video",
  children: [{
    name: "video",
    path: "video",
    component: function component(resolve) {
      return require(["@/views/main/video/video.vue"], resolve);
    }
  }]
}];
var router = new _vueRouter["default"]({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: routes
});
var _default = router;
exports["default"] = _default;