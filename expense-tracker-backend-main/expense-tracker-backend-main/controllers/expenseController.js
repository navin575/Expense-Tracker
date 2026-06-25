// const User = require("../models/User");
const xlsx = require("xlsx");
const Expense = require("../models/Expense");
// const { project } = require("../middleware/authMiddleware");

// Add Income source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    
    try {
       const { icon, category, amount, date } = req.body;
       
       //Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Please fill all fields" });
        }   

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });    
    }
}   

// Get All Expense source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });
    }
}

// Delete Expense source
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.id;

    try {
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });

        if (!expense) {
            return res.status(404).json({ message: "Expense entry not found or unauthorized" });
        }

        res.json({ message: "Expense source deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });
    }
};


// Download Excel file
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toISOString().split('T')[0], // Format date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");

        // Write workbook to buffer
        const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Set headers
        res.setHeader('Content-Disposition', 'attachment; filename=expense_details.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send file to client
        return res.send(excelBuffer);
    } catch (error) {
        console.error("Excel Download Error:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
};
