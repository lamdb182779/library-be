const { Op } = require("sequelize")
const db = require("../models")

const roles = [1, 2, 3]

exports.getAllUser = async (req, res) => {
    let { page = 1, pagesize = 5, keyword, types = "email-name" } = req.query

    page = parseInt(page) || 1
    pagesize = parseInt(pagesize) || 5
    types = types || "email-name"
    pagesize = pagesize > 15 ? 15 : pagesize

    types = types.split("-")
    let conditions = []
    let find = { active: true }
    if (keyword?.trim()) {
        types.forEach(type => {
            if (type === "name") conditions.push({ name: { [Op.iLike]: `%${keyword.trim()}%` } })
            if (type === "email") conditions.push({ email: { [Op.iLike]: `%${keyword.trim()}%` } })
        })
        find = { ...find, [Op.or]: conditions }
    }

    let skip = (page - 1) * pagesize
    try {
        let { count, rows } = await db.User.findAndCountAll({
            where: find,
            limit: pagesize,
            offset: skip,
            attributes: ["id", "email", "name", req?.user?.role === 1 && "role", "image"].filter(Boolean)
        })

        return res.status(200).json({
            message: "Get data successfully!",
            result: rows,
            pageCount: Math.ceil(count / pagesize)
        })
    } catch (error) {
        console.log("Cannot get data! Error:", error)
        return res.status(500).json({
            message: "Server error!",
        })
    }
}

exports.changeRole = async (req, res) => {
    let id = req.params.id.toString()

    let { role } = req.body
    role = roles.includes(parseInt(role)) ? parseInt(role) : 3

    try {
        let data = await db.User.update({ role: role }, {
            where: {
                id: id,
                role: {
                    [Op.ne]: 1
                }
            }
        })

        if (data[0] === 0) {
            console.log("Cannot update user!")
            return res.status(500).json({
                message: "Cannot update user!"
            })
        }
        return res.status(200).json({
            message: "Update user successfully!"
        })
    } catch (error) {
        console.log("Cannot update user! Error: ", error)
        return res.status(500).json({
            message: "server error!"
        })
    }
}

