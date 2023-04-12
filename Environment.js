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
    assign(name, value) {
        return (this.resolve(name).record[name] = value);
    }
    lookup(name) {
        return (this.resolve(name).record[name]);
    }
    resolve(name) {
        return (
            (this.record.hasOwnProperty(name) && this) ||
            (!this.parentEnv && _throw(UNDEFINED_VARIABLE + name)) ||
            (this.parentEnv.resolve(name))
        )
    }
}

module.exports = Environment;