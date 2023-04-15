const assert = require('assert');

module.exports = (eva) => {
    assert.strictEqual(eva.eval([
        'begin',
        ['var', 'x', 5],
        ['var', 'y', 10],
        ['*', ['*', 'x', 'y'], 2]
    ]), 100);
    assert.strictEqual(eva.eval([
        'begin',
        ['var', 'x', 10],
        [
            'begin',
            ['var', 'x', 20]
        ],
        'x'
    ]), 10);
    assert.strictEqual(eva.eval([
        'begin',
        ['var', 'value', 10],
        [
            'begin',
            ['var', 'x', ['+', 'value', 10]],
            'x'
        ]
    ]), 20);
    assert.strictEqual(eva.eval([
        'begin',
        ['var', 'data', 10],
        [
            'begin',
            ['set', 'data', 100],
        ],
        'data'
    ]), 100);
}