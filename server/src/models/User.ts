import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
