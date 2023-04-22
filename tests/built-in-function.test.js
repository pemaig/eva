const { test } = require('./test-util');

module.exports = (eva) => {
    test(eva, `(+ 1 5)`, 6);
    test(eva, `(- 5 1)`, 4);
    test(eva, `(* 2 3)`, 6);
}