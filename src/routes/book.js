const express = require("express")
const router = express.Router()

const { addBook, getBooks, getBookById, updateBook } = require("../controllers/book")
const { secondRank } = require("../middleware/permission-action")

const book = (route) => {
    router.all("*", secondRank)
    router.put("/:id", updateBook)
    router.post("/", addBook)
    router.get("/", getBooks)
    router.get("/:id", getBookById)
    return route.use("/book", router)
}

module.exports = book