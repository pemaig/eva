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
const isAssignment = (exp) => exp[0] === 'set';

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
        };
        if (isAssignment(exp)) {
            const [_, name, value] = exp;

            return env.assign(name, this.eval(value, env))
        };

        _throw(UNIMPLEMENTED_ERROR + JSON.stringify(exp));
    }
}

module.exports = Eva;