const express=require("express");
const{
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
}= require("../controllers/expenseController");
const { project } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", project, addExpense);
router.get("/get", project, getAllExpense);
router.get("/downloadexcel", project, downloadExpenseExcel);
router.delete("/:id", project, deleteExpense);

module.exports = router;