const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function loadRules(file = 'default.yaml') {
  const rulesPath = path.join(__dirname, '..', 'rules', file);
  if (!fs.existsSync(rulesPath)) return { thresholds: { maxAmount: 100000, autoApproveScore: 750, minScore: 500 } };
  try {
    const doc = yaml.load(fs.readFileSync(rulesPath, 'utf8'));
    return doc || {};
  } catch (e) {
    return { thresholds: { maxAmount: 100000, autoApproveScore: 750, minScore: 500 } };
  }
}

function evaluate({ amount, riskScore, compliancePassed }) {
  const cfg = loadRules();
  const thr = cfg.thresholds || {};
  const maxAmount = thr.maxAmount ?? 100000;
  const autoApproveScore = thr.autoApproveScore ?? 750;
  const minScore = thr.minScore ?? 500;

  if (!compliancePassed) return { decision: 'reject', reason: 'Compliance failed' };
  if (amount > maxAmount) return { decision: 'manual_review', reason: 'Amount exceeds threshold' };
  if (riskScore >= autoApproveScore) return { decision: 'approve', reason: 'High score auto-approve' };
  if (riskScore < minScore) return { decision: 'reject', reason: 'Score below minimum' };
  return { decision: 'manual_review', reason: 'Requires underwriter review' };
}

module.exports = { loadRules, evaluate };