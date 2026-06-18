import Notification from "../models/Notification.js";

export const createNotification = async ({ userId, title, message, appointmentId }) => {
  if (!userId || !title || !message) return null;

  return Notification.create({
    userId,
    title,
    message,
    appointmentId
  });
};

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMyNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );

    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      message: "Notifications marked as read",
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
