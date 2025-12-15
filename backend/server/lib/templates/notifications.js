function buildTemplate(type, data) {
  switch (type) {
    case 'application_received':
      return `Hi ${data.full_name}, your application has been received. Ref: ${data.refId}.`;
    case 'under_review':
      return `Your application ${data.refId} is under review.`;
    case 'approved':
      return `Congratulations! Application ${data.refId} is approved.`;
    case 'rejected':
      return `We’re sorry. Application ${data.refId} was not approved. Reason: ${data.reason}.`;
    case 'disbursed':
      return `Funds for loan ${data.loanId} have been disbursed.`;
    default:
      return `Update for your application.`;
  }
}

module.exports = { buildTemplate };