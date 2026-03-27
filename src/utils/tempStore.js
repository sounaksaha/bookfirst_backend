const tempUsers = new Map();

exports.saveTempUser = (phone, data) => {
  tempUsers.set(phone, data);
};

exports.getTempUser = (phone) => {
  return tempUsers.get(phone);
};

exports.deleteTempUser = (phone) => {
  tempUsers.delete(phone);
};