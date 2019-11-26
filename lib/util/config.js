'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProgramConfig = exports.defaultConfig = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = exports.defaultConfig = {
    projectRoot: '.'
};

var getProgramConfig = exports.getProgramConfig = function getProgramConfig(givenConfig) {
    var config = Object.assign({}, defaultConfig, givenConfig);

    config.projectRoot = _path2.default.resolve(process.cwd(), config.projectRoot);

    return config;
};