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
    typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp));
const isBlock = (exp) => exp[0] === 'begin';

class Eva {
    constructor(globalEnv = new Environment()) {
        this.globalEnv = globalEnv;
    }
    eval(exp, env = this.globalEnv) {
        if (isNumber(exp)) return exp;
        if (isString(exp)) return exp.slice(1, -1);
        if (isAddition(exp)) return this.eval(exp[1], env) + this.eval(exp[2], env);
        if (isSubstracrion(exp)) return this.eval(exp[1], env) - this.eval(exp[2], env);
        if (isMultiplication(exp)) return this.eval(exp[1], env) * this.eval(exp[2], env);
        if (isDivision(exp)) return this.eval(exp[1], env) / this.eval(exp[2], env);
        if (isRemainder(exp)) return this.eval(exp[1], env) % this.eval(exp[2], env);
        if (isVariableDeclaration(exp)) {
            const [_, name, value] = exp;

            return env.define(name, this.eval(value, env));
        };
        if (isVariableName(exp)) return env.lookup(exp);
        if (isBlock(exp)) {
            let blockEnv = new Environment({}, env);
            let [_, ...exps] = exp;
            let result;

            exps.forEach(subExp => {
                result = this.eval(subExp, blockEnv);
            })

            return result;
        }

        _throw(UNIMPLEMENTED_ERROR + JSON.stringify(exp));
    }
}

// ------------- TESTS -------------------------
const env = new Environment({
    null: null,
    true: true,
    false: false
})
const eva = new Eva(env);

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
{
    assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
    assert.strictEqual(eva.eval('x'), 10);
    assert.strictEqual(eva.eval(['var', 'y', 'null']), null);
    assert.strictEqual(eva.eval('y'), null);
    assert.strictEqual(eva.eval(['var', 'a', 'true']), true);
    assert.strictEqual(eva.eval('a'), true);
    assert.strictEqual(eva.eval(['var', 'z', ['+', 3, 5]]), 8);
}

// Blocks 
{
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
}

console.log('Tests are passed');