const Eva = require('../Eva');
const tests = [
    require('./eval.test'),
    require('./math.test'),
    require('./variables.test'),
    require('./blocks.test'),
    require('./if.test'),
    require('./while.test'),
    require('./built-in-function.test'),
    require('./user-defined-function.test'),
    require('./lambda-function.test'),
]

const eva = new Eva();

tests.forEach(test => test(eva));

eva.eval(['print', '"Hello"', '"World!"']);

console.log('Tests are passed');