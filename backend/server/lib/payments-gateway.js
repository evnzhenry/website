// Mock payments gateway for disbursement
async function disburse({ loanId, accountId, amount, currency }) {
  const providerRef = `PG-${loanId}-${Date.now()}`;
  return { status: 'queued', provider_ref: providerRef };
}

module.exports = { disburse };