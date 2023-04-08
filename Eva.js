const assert = require('assert');
const _throw = require('./throw');
const Environment = require('./Environment');
const { UNIMPLEMENTED_ERROR } = require('./errors');

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
const isVariableDeclaration = (exp) => exp[0] === 'var';
const isVariableName = (exp) => (
    typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp))


class Eva {
    constructor(globalEnv = new Environment()) {
        this.globalEnv = globalEnv;
    }
    eval(exp, env = this.globalEnv) {
        if (isNumber(exp)) return exp;
        if (isString(exp)) return exp.slice(1, -1);
        if (isAddition(exp)) return this.eval(exp[1]) + this.eval(exp[2]);
        if (isSubstracrion(exp)) return this.eval(exp[1]) - this.eval(exp[2]);
        if (isMultiplication(exp)) return this.eval(exp[1]) * this.eval(exp[2]);
        if (isDivision(exp)) return this.eval(exp[1]) / this.eval(exp[2]);
        if (isRemainder(exp)) return this.eval(exp[1]) % this.eval(exp[2]);
        if (isVariableDeclaration(exp)) {
            const [_, name, value] = exp;
            return env.define(name, value);
        };
        if (isVariableName(exp)) {
            return env.lookup(exp);
        }

        _throw(UNIMPLEMENTED_ERROR + JSON.stringify(exp));
    }
}

// ------------- TESTS -------------------------
const eva = new Eva();

// Math
{
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
}

// Variables
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10);

console.log('Tests are passed');