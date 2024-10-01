const express = require('express');
const router = express.Router();
const Expense = require('../Models/Expense'); // Assume you've created an Expense model
const User = require('../Models/Users');
const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(400).send('You don\'t have a token');
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.userId = decoded._id; // Set user ID from token
            next();
        });

    } catch (error) {
        res.status(404).send("An error occurred");
    }
}

// Add expenses
router.post('/add-expense', verifyToken, async (req, res) => {
    const { category, description, amount, date } = req.body;

    const expense = new Expense({
        category,
        description,
        amount,
        date,
        userId: req.userId // Use the user ID from the verified token
    });

    try {
        await expense.save();
        await User.findByIdAndUpdate(req.userId, { $push: { expenses: expense._id } }); // Update user's expense list
        res.status(201).json(expense);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get expenses
router.get('/expenses', verifyToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId }); // Use userId from the verified token
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//delete expense

router.delete('/delete-expense/:id', verifyToken, async (req, res) => {
    const expenseId = req.params.id; // Updated variable name to 'expenseId' for consistency
    try {
        // Find and delete the expense associated with the user
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId: req.userId });

        if (!expense) {
            return res.status(404).send("Expense not found");;
        }

        // Optional: Remove the expense reference from the User model
        await User.findByIdAndUpdate(req.userId, { $pull: { expenses: expenseId } });

        return res.status(200).send("Expense deleted successfully"); 
    } catch (error) {
        return res.status(500).jsend("An eeror occured");;
    }
});






module.exports = router;
