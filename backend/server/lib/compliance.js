// Simple compliance checks: KYC/AML placeholders
function runComplianceChecks(app) {
  const checks = [];
  // Age >= 18
  const ageOk = app.age >= 18;
  checks.push({ code: 'AGE_MIN', passed: ageOk, message: ageOk ? 'Age OK' : 'Applicant must be 18+' });
  // Amount <= 100000
  const amtOk = app.loan_amount <= 100000;
  checks.push({ code: 'AMOUNT_LIMIT', passed: amtOk, message: amtOk ? 'Amount within limit' : 'Amount exceeds max threshold' });
  // Basic email presence
  const emailOk = !!app.email && app.email.includes('@');
  checks.push({ code: 'EMAIL_FORMAT', passed: emailOk, message: emailOk ? 'Email valid' : 'Invalid email' });
  const passed = checks.every(c => c.passed);
  return { passed, checks };
}

module.exports = { runComplianceChecks };