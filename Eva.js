const assert = require('assert');

const UNIMPLEMENTED_ERROR = 'Unimplemented expression: ';

const _throw = (msg) => { throw new Error(msg) };
const isNumber = (exp) => typeof exp === 'number';
const isString = (exp) => (
    typeof exp === 'string' &&
    exp[0] === '"' &&
    exp[exp.length - 1] === '"'
);
const isAddition = (exp) => exp[0] === '+';
const isSubstracrion = (exp) => exp[0] === '-';
const isMultiplication = (exp) => exp[0] === '*';
const isDivision = (exp) => exp[0] === '/';
const isRemainder = (exp) => exp[0] === '%';


class Eva {
    eval(exp) {
        if (isNumber(exp)) return exp;
        if (isString(exp)) return exp.slice(1, -1);
        if (isAddition(exp)) return this.eval(exp[1]) + this.eval(exp[2]);
        if (isSubstracrion(exp)) return this.eval(exp[1]) - this.eval(exp[2]);
        if (isMultiplication(exp)) return this.eval(exp[1]) * this.eval(exp[2]);
        if (isDivision(exp)) return this.eval(exp[1]) / this.eval(exp[2]);
        if (isRemainder(exp)) return this.eval(exp[1]) % this.eval(exp[2]);

        throw (UNIMPLEMENTED_ERROR + JSON.stringify(exp));
    }
}

// ------------- TESTS -------------------------
const eva = new Eva();
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"hello"'), 'hello');
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
console.log('Tests are passed');