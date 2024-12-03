const express = require("express")
const router = express.Router()

const { userGetBooks, userGetBookById } = require("../controllers/book")

const search = (route) => {
    router.get("/", userGetBooks)
    router.get("/:id", userGetBookById)
    return route.use("/search", router)
}

module.exports = search