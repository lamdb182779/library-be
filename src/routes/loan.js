const express = require("express")
const router = express.Router()

const { addBookReader, returnBook, getLoans, deleteLoan } = require("../controllers/bookReaderController")
const { secondRank } = require("../middleware/permission-action")

const loan = (route) => {
    router.all("*", secondRank)
    router.put("/", returnBook)
    router.post("/", addBookReader)
    router.get("/", getLoans)
    router.delete("/", deleteLoan)
    return route.use("/loan", router)
}

module.exports = loan