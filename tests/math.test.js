const assert = require('assert');

module.exports = (eva) => {
    assert.strictEqual(eva.eval(['+', 1, 5]), 6);
    assert.strictEqual(eva.eval(['-', 5, 1]), 4);
    assert.strictEqual(eva.eval(['*', 2, 3]), 6);
    assert.strictEqual(eva.eval(['/', 8, 4]), 2);
    assert.strictEqual(eva.eval(['%', 3, 2]), 1);
    assert.strictEqual(eva.eval(['+', ['+', 2, 3], 5]), 10);
    assert.strictEqual(eva.eval(['-', ['-', 3, 2], 1]), 0);
    assert.strictEqual(eva.eval(['*', ['*', 3, 2], 2]), 12);
    assert.strictEqual(eva.eval(['/', ['/', 6, 2], 3]), 1);
    assert.strictEqual(eva.eval(['%', ['%', 9, 5], 3]), 1);
}