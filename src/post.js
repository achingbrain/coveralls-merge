import request from 'request';
import {getServiceName} from './util/helpers';
import {getGitInfo} from './util/git';

export const post = source_files => {
    const repo_token = process.env.COVERALLS_REPO_TOKEN;

    if (!repo_token && !process.env.TRAVIS) {
        throw new Error('COVERALLS_REPO_TOKEN environment variable not set');
    }

    const url = 'https://coveralls.io/api/v1/jobs',
        json = JSON.stringify({
            repo_token,
            service_name: getServiceName(),
            source_files,
            git: getGitInfo()
        });
console.info('posting to', url, json)
    request.post(
        {
            url,
            form: {
                json
            }
        },
        (error, response) => {
            if (error) {
                throw new Error(`Error sending data to Coveralls: ${error}`);
            } else {
                const body = JSON.parse(response.body)

                if (body.error) {
                    throw new Error(body.message)
                }

                console.log('POST to Coveralls successful!');
                console.log('Job URL:', body.url);
            }
        }
    );
};
