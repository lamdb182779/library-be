const db = require('../models');
const { Op } = require("sequelize")

// Thêm tag mới
exports.addTag = async (req, res) => {
    try {
        // Kiểm tra xem name có được cung cấp và hợp lệ hay không
        if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
            console.log('Tag name must be a valid');
            return res.status(400).json({ message: 'Thể loại không hợp lệ' });
        }

        const { name, describe } = req.body;

        const newTag = await db.Tag.create({
            name,
            describe
        });

        return res.status(201).json({ message: 'Tag created successfully', tag: newTag });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Xóa tag
exports.deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem tag với `id` có tồn tại không
        const tag = await db.Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // Xóa tag
        await tag.destroy();

        return res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Cập nhật tag
exports.updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, describe } = req.body;

        // Kiểm tra xem tag với `id` có tồn tại không
        const tag = await db.Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        }

        // Kiểm tra tính hợp lệ của tên nếu có
        if (name && (typeof name !== 'string' || name.trim() === '')) {
            return res.status(400).json({ message: 'Tên thể loại không hợp lệ' });
        }

        // Cập nhật thông tin mới cho tag
        tag.name = name || tag.name;
        tag.describe = describe || tag.describe;

        await tag.save();

        // Trả về phản hồi thành công với thông tin tag đã cập nhật
        return res.status(200).json({ message: 'Tag updated successfully', tag });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.getTags = async (req, res) => {
    try {
        let { page = 1, pagesize = 10, keyword = "" } = req.query;


        page = parseInt(page) || 1
        pagesize = parseInt(pagesize) || 10
        pagesize = pagesize > 50 ? 50 : pagesize

        let skip = (page - 1) * pagesize
        let { count, rows } = await db.Tag.findAndCountAll({
            where: { name: { [Op.iLike]: `%${keyword.trim()}%` } },
            limit: pagesize,
            offset: skip,
            attributes: ["id", "name", "describe"]
        })

        return res.status(200).json({
            message: "Get data successfully!",
            result: rows,
            pageCount: Math.ceil(count / pagesize)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.getTagById = async (req, res) => {
    try {
        const { id } = req.params;

        const tag = await db.Tag.findByPk(id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        return res.status(200).json({
            message: "Get data successfully!",
            result: tag
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};