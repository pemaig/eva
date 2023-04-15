const Environment = require('../Environment');
const Eva = require('../Eva');
const tests = [
    require('./eval.test'),
    require('./math.test'),
    require('./variables.test'),
    require('./blocks.test'),
    require('./if.test'),
]

const env = new Environment({
    null: null,
    true: true,
    false: false
})
const eva = new Eva(env);

tests.forEach(test => test(eva));

console.log('Tests are passed');