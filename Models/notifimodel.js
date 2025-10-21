import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  notification: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
