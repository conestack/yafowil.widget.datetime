const percentage = {
    lines: 93,
    statements: 93,
    functions: 97,
    branches: 93
}
var summary = require('./karma/coverage/coverage-summary.json');

for (let res in summary.total) {
    if (summary.total[res].pct < percentage[res]) {
        throw new Error(
        `Coverage too low on ${res},
        expected: ${percentage[res]},
        got: ${summary.total[res].pct}`
        );
    }
}