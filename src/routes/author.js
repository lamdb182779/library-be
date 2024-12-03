const express = require("express")
const router = express.Router()

const { addAuthor, getAuthors, getAuthorById, updateAuthor } = require("../controllers/author")
const { secondRank } = require("../middleware/permission-action")

const author = (route) => {
    router.all("*", secondRank)
    router.put("/:id", updateAuthor)
    router.post("/", addAuthor)
    router.get("/", getAuthors)
    router.get("/:id", getAuthorById)
    return route.use("/author", router)
}

module.exports = author