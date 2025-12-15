// Mock credit bureau adapter; in production integrate with external provider
async function fetchCreditReport(applicant) {
  const base = 600;
  const ageBoost = applicant.age && applicant.age > 25 ? 50 : 0;
  const amountPenalty = applicant.requestedAmount && applicant.requestedAmount > 20000 ? -75 : 0;
  const score = Math.max(300, Math.min(850, base + ageBoost + amountPenalty));
  return {
    bureau_name: 'MockBureau',
    score,
    report_url: null,
    pulled_at: new Date().toISOString()
  };
}

module.exports = { fetchCreditReport };