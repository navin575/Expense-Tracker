const express=require("express");
const{
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel,
    getAllIncomeWithDetails
}= require("../controllers/incomeController");
const { project } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/add", project, addIncome);
router.get("/get", project, getAllIncome);
router.get("/downloadexcel", project, downloadIncomeExcel);
router.delete("/:id", project, deleteIncome);

// router.get("/getAllIncomeWithDetails",project,getAllIncomeWithDetails);

module.exports = router;