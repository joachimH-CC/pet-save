(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/saverApplyList/common/vendor"],{

/***/ 297:
/*!********************************************************************************!*\
  !*** D:/DevelopProject/HbuilerXProject/petAdopt/api/rescuerApi/rescueApply.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.approvedApply = approvedApply;
exports.comfirmContract = comfirmContract;
exports.refuseApply = refuseApply;
exports.rescueApplyDetail = rescueApplyDetail;
exports.rescueApplyList = rescueApplyList;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 174));
/**
 * 申请列表
 * @param {Object} data
 */
function rescueApplyList(data) {
  return (0, _request.default)({
    url: "/msApply/list",
    method: "get",
    data: data
  });
}
/**
 * 申请详情
 * @param {Object} data
 */
function rescueApplyDetail(applyId) {
  return (0, _request.default)({
    url: "/msApply/".concat(applyId),
    method: "get"
  });
}
/**
 * 申请审核通过
 * @param {Object} data
 */
function approvedApply(data) {
  return (0, _request.default)({
    url: "/msApply/approved",
    method: "put",
    data: data
  });
}
/**
 * 申请审核拒绝通过
 * @param {Object} data
 */
function refuseApply(data) {
  return (0, _request.default)({
    url: '/msApply/refuse',
    method: "put",
    data: data
  });
}
/**
 * 签署合同
 * @param {Object} data
 */
function comfirmContract(data) {
  return (0, _request.default)({
    url: '/msApply/contract',
    method: "put",
    data: data
  });
}

/***/ })

}]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/saverApplyList/common/vendor.js.map