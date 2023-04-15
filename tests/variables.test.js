const assert = require('assert');

module.exports = (eva) => {
    assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
    assert.strictEqual(eva.eval('x'), 10);
    assert.strictEqual(eva.eval(['var', 'y', 'null']), null);
    assert.strictEqual(eva.eval('y'), null);
    assert.strictEqual(eva.eval(['var', 'a', 'true']), true);
    assert.strictEqual(eva.eval('a'), true);
    assert.strictEqual(eva.eval(['var', 'z', ['+', 3, 5]]), 8);
}