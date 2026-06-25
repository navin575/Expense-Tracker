const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add Income
exports.addIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, source, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        console.error("Add income error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};


exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;

    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch full transaction details instead of grouping & losing info
        const income = await Income.find({
            userId: userId,
            date: { $gte: thirtyDaysAgo }
        })
            .sort({ date: -1 }) // newest first
            .lean();

        // Format so frontend receives proper fields
        const formattedIncome = income.map((item) => ({
            id: item._id,
            title: item.source || "Untitled",   // Ensure fallback title
            icon: item.icon || null,           // Icon path or null
            date: item.date,
            amount: item.amount,
            type: "income",                    // Can be useful for UI
        }));

        res.json(formattedIncome);
    } catch (error) {
        console.error("Income fetch error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};


//Delete Income
exports.deleteIncome = async (req, res) => {
    const userId = req.user._id;
    const incomeId = req.params.id; // make sure :id is present in route

    console.log("Delete income requested with id:", incomeId);  // Add this

    if (!incomeId) {
        return res.status(400).json({ message: "Income ID is required" });
    }

    try {
        // Use the correct Mongoose method and query by _id and userId
        const income = await Income.findOneAndDelete({ _id: incomeId, userId });

        if (!income) {
            return res.status(404).json({ message: "Income entry not found or unauthorized" });
        }

        res.json({ message: "Income source deleted successfully" });
    } catch (error) {
        console.error("Delete income error:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};


// Download Income Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date.toISOString().split('T')[0],
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename=income_details.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(excelBuffer);
    } catch (error) {
        console.error("Excel Download Error:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
};

