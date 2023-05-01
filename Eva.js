const _throw = require('./throw');
const Environment = require('./Environment');
const { UNIMPLEMENTED_ERROR } = require('./errors');

const isNumber = (exp) => typeof exp === 'number';
const isString = (exp) => (
    typeof exp === 'string' &&
    exp[0] === '"' &&
    exp[exp.length - 1] === '"'
);
const isDeclaration = (exp) => exp[0] === 'var';
const isFunctionDeclaration = (exp) => exp[0] === 'def';
const isAssignment = (exp) => exp[0] === 'set';
const isVariableName = (exp) => (
    typeof exp === 'string' && /^[+\-*/<>=%a-zA-Z0-9_]*$/.test(exp));
const isBlock = (exp) => exp[0] === 'begin';
const isIf = (exp) => exp[0] === 'if';
const isWhile = (exp) => exp[0] === 'while';
const isIncrement = (exp) => exp[0] === '++';
// TODO: 
// Implement logical operators: (or foo default), (and x y), (not value)
// const isOr = (exp) => exp[0] === 'or';
// const isAnd = (exp) => exp[0] === 'and';
// const isNot = (exp) => exp[0] === 'not';


class Eva {
    constructor(globalEnv = GlobalEnvironment) {
        this.globalEnv = globalEnv;
    }
    eval(exp, env = this.globalEnv) {
        if (isNumber(exp)) return exp;
        if (isString(exp)) return exp.slice(1, -1);
        if (isIncrement(exp)) {
            const [_, varName] = exp;
            const oldValue = env.lookup(varName);
            const newValue = oldValue + 1;

            env.assign(varName, newValue);

            return newValue;
        };
        if (isDeclaration(exp)) {
            const [_, name, value] = exp;

            return env.define(name, this.eval(value, env));
        };
        if (isVariableName(exp)) return env.lookup(exp);
        if (isBlock(exp)) {
            const blockEnv = new Environment({}, env);
            
            return this._evalBlock(exp, blockEnv);
        };
        if (isAssignment(exp)) {
            const [_, name, value] = exp;

            return env.assign(name, this.eval(value, env))
        };
        if (isIf(exp)) {
            const [_, condition, trueBranch, falseBranch] = exp;

            return this.eval(condition, env) ? this.eval(trueBranch, env) : this.eval(falseBranch, env);
        }
        if (isWhile(exp)) {
            const [_, condition, body] = exp;
            let result;

            while (this.eval(condition, env)) {
                result = this.eval(body, env);
            }

            return result;
        }
        if (isFunctionDeclaration(exp)) {
            const [_, name, params, body] = exp;

            const fn = {
                params,
                body,
                env
            };

            return env.define(name, fn);
        }
        if (Array.isArray(exp)) {
            const fn = this.eval(exp[0], env);
            const args = exp
                .slice(1)
                .map(arg => this.eval(arg, env));


            if (typeof fn === 'function') {
                return fn(...args);
            }

            const activationRecord = {};

            fn.params.forEach((param, index) => {
                activationRecord[param] = args[index];
            });

            const activationEnv = new Environment(activationRecord, fn.env);

            return this._evalBody(fn.body, activationEnv);
        }

        _throw(UNIMPLEMENTED_ERROR + JSON.stringify(exp));
    }
    _evalBody(body, env) {
        if (isBlock(body)) {
            return this._evalBlock(body, env);
        }

        return this.eval(body, env);
    }
    _evalBlock(block, env) {
        const [_, ...exps] = block;
        let result;

        exps.forEach(subExp => {
            result = this.eval(subExp, env);
        })

        return result;
    }
}

const GlobalEnvironment = new Environment({
    null: null,
    true: true,
    false: false,

    '+'(op1, op2) {
        return op1 + op2;
    },
    '-'(op1, op2 = null) {
        return op2 === null ? (-op1) : (op1 - op2);
    },
    '*'(op1, op2) {
        return op1 * op2;
    },
    '/'(op1, op2) {
        return op1 / op2;
    },
    '%'(op1, op2) {
        return op1 % op2;
    },
    '>'(op1, op2) {
        return op1 > op2;
    },
    '<'(op1, op2) {
        return op1 < op2;
    },
    '>='(op1, op2) {
        return op1 >= op2;
    },
    '<='(op1, op2) {
        return op1 <= op2;
    },
    '='(op1, op2) {
        return op1 === op2;
    },
    print(...args) {
        console.log(...args);
    }
})

module.exports = Eva;