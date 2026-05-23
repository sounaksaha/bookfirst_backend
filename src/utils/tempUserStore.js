const tempUsers = new Map();

const ONE_HOUR = 60 * 60 * 1000;

exports.saveVerifiedPhoneSession = (phone) => {
  tempUsers.set(phone, {
    phone,
    isOtpVerified: true,
    expiresAt: Date.now() + ONE_HOUR,
  });
};

exports.getVerifiedPhoneSession = (phone) => {
  const session = tempUsers.get(phone);

  if (!session) {
    return null;
  }

  if (Date.now() > session.expiresAt) {
    tempUsers.delete(phone);
    return null;
  }

  return session;
};

exports.deleteTempUser = (phone) => {
  return tempUsers.delete(phone);
};