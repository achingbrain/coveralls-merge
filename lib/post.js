'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.post = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _helpers = require('./util/helpers');

var _git = require('./util/git');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var post = exports.post = function post(source_files) {
    var repo_token = process.env.COVERALLS_REPO_TOKEN;

    if (!repo_token && !process.env.TRAVIS) {
        throw new Error('COVERALLS_REPO_TOKEN environment variable not set');
    }

    var url = 'https://coveralls.io/api/v1/jobs',
        json = JSON.stringify({
        repo_token: repo_token,
        service_name: (0, _helpers.getServiceName)(),
        source_files: source_files,
        git: (0, _git.getGitInfo)()
    });

    _request2.default.post({
        url: url,
        form: {
            json: json
        }
    }, function (error, response) {
        if (error) {
            throw new Error('Error sending data to Coveralls: ' + error);
        } else {
            console.log('POST to Coveralls successful!');
            console.log('Job URL:', JSON.parse(response.body));
        }
    });
};