"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var merge = exports.merge = function merge(reports) {
  return reports.reduce(function (a, b) {
    return a.concat(b);
  });
};