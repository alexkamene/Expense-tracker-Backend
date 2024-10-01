const mongoose = require('mongoose');
const{Schema}=mongoose;

const expenseSchema = new mongoose.Schema({
  category: { type: String},
  description: { type: String},

  amount: { type: Number},
  date: { type: Date },
  userId: { 
    type: Schema.Types.ObjectId,  // This ensures it's the same as the MongoDB _id
    ref: 'Users',  // Refers to the User model
  // Ensures that userId is always required
  }
});
//Users

module.exports = mongoose.model('Expense', expenseSchema);
