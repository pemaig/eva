const assert = require('assert');

function _throw(msg) {
    throw new Error(msg);
}
function isNumber(exp) {
    return typeof exp === 'number';
}
function isString(exp) {
    return (
        typeof exp === 'string' &&
        exp[0] === '"' &&
        exp[exp.length - 1] === '"'
    );
}
function isAddition(exp) {
    return exp[0] === '+';
}
function sum(exp) {
    // ['+', ['+', 2, 3], 5] = 10
    const ERROR = 'One of the addition variables is not a Number';
    const left = exp[1];
    const right = exp[2];

    return (
        (isAddition(left) ? sum(left)
            : isNumber(left) ? left
                : _throw(ERROR)
        )
        +
        (isAddition(right) ? sum(right)
            : isNumber(right) ? right
                : _throw(ERROR)
        )
    );
}

class Eva {
    eval(exp) {
        if (isNumber(exp)) {
            return exp;
        }
        if (isString(exp)) {
            return exp.slice(1, -1);
        }
        if (isAddition(exp)) {
            return sum(exp);
        }

        _throw('Unimplemented');
    }
}

// ------------- TESTS -------------------------
const eva = new Eva();
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"hello"'), 'hello');
assert.strictEqual(eva.eval(['+', 1, 5]), 6);
assert.strictEqual(eva.eval(['+', ['+', 2, 3], 5]), 10);
console.log('Tests are passed');