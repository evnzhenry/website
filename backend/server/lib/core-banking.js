// Core banking sync stub
async function syncOrigination({ loanId, principal, rateApr, termMonths }) {
  return { ok: true, ledgerId: `LEDGER-${loanId}` };
}

module.exports = { syncOrigination };