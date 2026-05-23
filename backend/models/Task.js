const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    categories: {
      type: [String],
      default: [],
      set: (categories) =>
        Array.isArray(categories)
          ? categories.map((category) => category.trim()).filter(Boolean)
          : []
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
