// Minimal provider stubs simulating external payouts
// Methods: mobile_money, bank_transfer

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

async function processMobileMoney({ amount, currency, mobile_phone, sourceAccount }) {
  await delay(500);
  if (!mobile_phone) {
    return { status: 'failed', error_reason: 'Missing mobile_phone' };
  }
  // Simulate usage of source account
  console.log(`[Provider] Disbursing ${amount} ${currency} to ${mobile_phone} from Source: ${sourceAccount ? sourceAccount.name : 'Unknown'}`);

  // Simulate success with a provider reference
  return { status: 'succeeded', provider_ref: `MM-${Date.now()}` };
}

async function processBankTransfer({ amount, currency, bank_account_number, bank_code, bank_name, account_name, sourceAccount }) {
  await delay(800);
  if (!bank_account_number || !bank_code) {
    return { status: 'failed', error_reason: 'Missing bank account details' };
  }
  console.log(`[Provider] Disbursing ${amount} ${currency} to ${bank_account_number} (${bank_name}) from Source: ${sourceAccount ? sourceAccount.name : 'Unknown'}`);
  return { status: 'succeeded', provider_ref: `BT-${Date.now()}` };
}

module.exports = { processMobileMoney, processBankTransfer };