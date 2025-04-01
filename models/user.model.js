const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Task = require('../models/task.model');
const Category = require('../models/category.model');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.verifyPassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.pre('findOneAndDelete', async function (next) {
  const userId = this.getQuery()._id;
  await Task.deleteMany({ user: userId }); // Delete all tasks belonging to the user
  next();
});
userSchema.pre('findOneAndDelete', async function (next) {
  const userId = this.getQuery()._id;
  await Category.deleteMany({ user: userId }); // Delete all Categories belonging to the user
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
