import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    user_login: {
      type: String,
      required: true,
      unique: true,
      maxlength: 60,
      match: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      trim: true,
    },
    user_pass: { type: String, required: true },
    user_nicename: { type: String, default: "", maxlength: 50 },
    user_email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      trim: true,
    },
    user_level: { type: Number, default: 0 },
    user_registered: { type: Date, default: Date.now },
    user_activation_key: { type: String, default: "" },
    user_status: { type: Number, default: 0 },
  },
  {
    collection: "wp_users",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UsersModel = mongoose.model("wp_users", UsersSchema);
export default UsersModel;
