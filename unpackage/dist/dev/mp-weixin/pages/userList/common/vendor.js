(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/userList/common/vendor"],{

/***/ 372:
/*!***************************************************************************!*\
  !*** D:/DevelopProject/HbuilerXProject/petAdopt/api/userApi/myCollect.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adoptNotice = adoptNotice;
exports.userCollect = userCollect;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 174));
/**
 * 我的收藏
 * @param {Object} data
 */
function userCollect() {
  return (0, _request.default)({
    url: "/msUserCollection",
    method: "get"
  });
}
/**
 * 用户设置领养提醒
 * @param {Object} data
 */
function adoptNotice(data) {
  return (0, _request.default)({
    url: "/msUserCollection/set/adopt/notice",
    method: "post",
    data: data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

/***/ }),

/***/ 413:
/*!*********************************************************************************!*\
  !*** D:/DevelopProject/HbuilerXProject/petAdopt/api/rescuerApi/returnRecord.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPetVisit = addPetVisit;
exports.deleteVisit = deleteVisit;
exports.editPetVisit = editPetVisit;
exports.returnPetList = returnPetList;
exports.visitList = visitList;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 174));
/**
 * 需回访宠物列表
 * @param {Object} data
 */
function returnPetList(data) {
  return (0, _request.default)({
    url: "/msReturnVisit/list",
    method: "get",
    data: data
  });
}
/**
 * 添加护理
 * @param {Object} data
 */
function visitList(applyId) {
  return (0, _request.default)({
    url: "/msReturnVisit/list/".concat(applyId),
    method: "get"
  });
}

/**
 * 编辑护理
 * @param {Object} data
 */
function addPetVisit(data) {
  return (0, _request.default)({
    url: "/msReturnVisit",
    method: "post",
    data: data
  });
}
/**
 * 编辑护理
 * @param {Object} data
 */
function editPetVisit(data) {
  return (0, _request.default)({
    url: "/msReturnVisit",
    method: "put",
    data: data
  });
}
/**
 * 删除记录
 * @param {Object} data
 */
function deleteVisit(returnVisitId) {
  return (0, _request.default)({
    url: "/msReturnVisit/".concat(returnVisitId),
    method: "delete"
  });
}

/***/ })

}]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userList/common/vendor.js.map