const express = require("express")
const router = express.Router()

const { addTag, getTags, getTagById, updateTag } = require("../controllers/tag")
const { secondRank } = require("../middleware/permission-action")

const tag = (route) => {
    router.all("*", secondRank)
    router.put("/:id", updateTag)
    router.post("/", addTag)
    router.get("/", getTags)
    router.get("/:id", getTagById)
    return route.use("/tag", router)
}

module.exports = tag