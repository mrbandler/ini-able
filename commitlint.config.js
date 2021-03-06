/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'subject-case': [2, 'always', 'sentence-case'],
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert', 'chore', 'merge', 'release', 'ci'],
        ],
    },
    ignores: [(message) => /^((?:Merge|Merged){1}).*/.test(message)],
    defaultIgnores: true,
};
