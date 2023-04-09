const _throw = require('./throw');
const { UNDEFINED_VARIABLE } = require('./errors');

class Environment {
    constructor(record = {}, parentEnv = null) {
        this.record = record;
        this.parentEnv = parentEnv;
    }
    define(name, value) {
        return (this.record[name] = value);
    }
    lookup(name) {
        return (name in this.record) ?
        this.record[name] : _throw(UNDEFINED_VARIABLE + name);
    }
    // todo: implement Identifier resolution
}

module.exports = Environment;