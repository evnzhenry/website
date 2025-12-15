const { evaluate } = require('./rules-engine');

function decide({ amount, riskScore, compliancePassed }) {
  return evaluate({ amount, riskScore, compliancePassed });
}

module.exports = { decide };