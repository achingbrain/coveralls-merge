'use strict';

var _parse = require('./parse');

var _merge = require('./merge');

var _post = require('./post');

var _config = require('./util/config');

module.exports = function (reports) {
    var givenConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var config = (0, _config.getProgramConfig)(givenConfig),
        reportPromises = reports.map(function (report) {
        return (0, _parse.parse)(report, config);
    });

    Promise.all(reportPromises).then(function (results) {
        var mergedResults = (0, _merge.merge)(results);

        (0, _post.post)(mergedResults);
    }).catch(function (error) {
        console.log('Error:', error);
        console.log(error.stack);
    });
};