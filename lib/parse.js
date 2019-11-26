'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parse = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _parseLcov = require('./parse/parse-lcov');

var _parseLcov2 = _interopRequireDefault(_parseLcov);

var _parseJacoco = require('./parse/parse-jacoco');

var _parseJacoco2 = _interopRequireDefault(_parseJacoco);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reports = {
    lcov: _parseLcov2.default,
    jacoco: _parseJacoco2.default
};

var parse = exports.parse = function parse(_ref, config) {
    var reportFile = _ref.reportFile,
        type = _ref.type,
        _ref$workingDirectory = _ref.workingDirectory,
        workingDirectory = _ref$workingDirectory === undefined ? '.' : _ref$workingDirectory;

    if (!reportFile) {
        throw new Error('Missing required parameter `reportFile`');
    }

    if (!type) {
        throw new Error('Missing required parameter `type`');
    }

    if (reports[type]) {
        config.workingDirectory = _path2.default.resolve(config.projectRoot, workingDirectory);

        return reports[type](reportFile, config);
    }

    throw new Error('Unsupported report type "' + type + '". Supported types are ' + Object.keys(reports).join(', '));
};