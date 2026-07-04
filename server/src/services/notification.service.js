const Notification = require('../models/Notification');

async function notify(userId, title, message) {
  return Notification.create({ userId, title, message });
}

async function getOwn(userId) {
  return Notification.find({ userId }).sort({ createdAt: -1 });
}

async function markRead(id, userId) {
  return Notification.updateOne({ _id: id, userId }, { $set: { isRead: true } });
}

module.exports = { notify, getOwn, markRead };
