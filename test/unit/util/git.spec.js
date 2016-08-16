import {getGitInfo} from '../../../src/util/git';

import {expect} from 'chai';
import Chance from 'chance';
import sinon from 'sinon';

import child_process from 'child_process';

describe('Get Git Info', () => {
    let chance,
        sandbox,
        execSyncStub,
        id,
        author_name,
        author_email,
        committer_name,
        committer_email,
        message,
        branch,
        remotes;

    function createFakeCatFile() {
        author_name = chance.pick([chance.name(), chance.first()]);
        author_email = chance.email();
        committer_name = chance.pick([chance.name(), chance.first()]);
        committer_email = chance.email();
        message = chance.paragraph();

        const lines = [
            `tree ${chance.hash()}`,
            `parent ${chance.hash()}`,
            `author ${author_name} <${author_email}> ${chance.natural()} ${chance.integer()}`,
            `committer ${committer_name} <${committer_email}> ${chance.natural()} ${chance.integer()}`,
            '',
            message,
            ''
        ];

        return lines.join('\n');
    }

    function createFakeBranches() {
        const randomSize = chance.natural({min: 2, max: 5}),
            randomBranches = chance.n(chance.word, randomSize),
            randomIndex = chance.natural({min: 0, max: randomSize - 1});

        branch = randomBranches[randomIndex];

        return randomBranches
            .map((branch, index) => {
                if (index === randomIndex) {
                    return `* ${branch}`;
                }

                return `  ${branch}`;
            })
            .join('\n');
    }

    function createRandomRemote() {
        return {
            name: chance.word(),
            url: chance.url({extensions: ['git']})
        }
    }

    function createFakeRemotes() {
        remotes = chance.n(createRandomRemote, chance.natural({min: 1, max: 3}));

        return remotes
            .map(remote => {
                return `${remote.name}\t${remote.url} (fetch)\n${remote.name}\t${remote.url} (push)`;
            })
            .join('\n');
    }

    beforeEach(() => {
        chance = new Chance();
        sandbox = sinon.sandbox.create();

        id = chance.hash();

        execSyncStub = sandbox.stub(child_process, 'execSync').returns();

        execSyncStub
            .withArgs('git cat-file -p HEAD')
            .returns({
                toString: createFakeCatFile
            });
        execSyncStub
            .withArgs('git branch')
            .returns({
                toString: createFakeBranches
            });
        execSyncStub
            .withArgs('git remote -v')
            .returns({
                toString: createFakeRemotes
            });
        execSyncStub
            .withArgs('git rev-parse HEAD')
            .returns({
                toString: () => ({trim: () => id})
            });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should retrieve the correct git information', () => {
        const actualGitInfo = getGitInfo(),
            expectedGitInfo = {
                head: {
                    id,
                    author_name,
                    author_email,
                    committer_name,
                    committer_email,
                    message
                },
                branch,
                remotes
            };

        expect(expectedGitInfo).to.deep.equal(actualGitInfo);
    });
});