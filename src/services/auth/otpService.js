const client = require("../../config/twilio");

exports.sendOtp = async (phone) => {
  return client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: `+91${phone}`,
      channel: "sms"
    });
};

exports.verifyOtp = async (phone, otp) => {
  return client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${phone}`,
      code: otp
    });
};