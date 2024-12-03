const db = require('../models');
const { Op } = require("sequelize")

// Thêm nhà xuất bản mới
exports.addPublisher = async (req, res) => {
    try {
        // Kiểm tra xem name có được cung cấp và hợp lệ hay không
        if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
            console.log('Publisher name must be a valid');
            return res.status(400).json({ message: 'Tên nhà xuất bản không đúng định dạng!' });
        }

        const { name } = req.body;

        const newPublisher = await db.Publisher.create({
            name
        });

        return res.status(201).json({ message: 'Publisher created successfully', publisher: newPublisher });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Xóa nhà xuất bản
exports.deletePublisher = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem nhà xuất bản với `id` có tồn tại không
        const publisher = await db.Publisher.findByPk(id);

        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found' });
        }

        // Xóa nhà xuất bản
        await publisher.destroy();

        return res.status(200).json({ message: 'Publisher deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Cập nhật nhà xuất bản
exports.updatePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Kiểm tra xem nhà xuất bản với `id` có tồn tại không
        const publisher = await db.Publisher.findByPk(id);

        if (!publisher) {
            return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
        }

        // Kiểm tra tính hợp lệ của tên nếu có
        if (name && (typeof name !== 'string' || name.trim() === '')) {
            return res.status(400).json({ message: 'Tên nhà xuất bản không đúng định dạng!' });
        }

        // Cập nhật thông tin mới cho nhà xuất bản
        publisher.name = name || publisher.name;

        await publisher.save();

        // Trả về phản hồi thành công với thông tin nhà xuất bản đã cập nhật
        return res.status(200).json({ message: 'Publisher updated successfully', publisher });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Lấy thông tin nhà xuất bản theo ID hoặc tất cả nếu không có ID
exports.getPublishers = async (req, res) => {
    try {
        let { page = 1, pagesize = 10, keyword = "" } = req.query;

        page = parseInt(page) || 1
        pagesize = parseInt(pagesize) || 10
        pagesize = pagesize > 50 ? 50 : pagesize

        let skip = (page - 1) * pagesize
        let { count, rows } = await db.Publisher.findAndCountAll({
            where: keyword?.trim() ? { name: { [Op.iLike]: `%${keyword.trim()}%` } } : {},
            limit: pagesize,
            offset: skip,
            attributes: ["id", "name"]
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

exports.getPublisherById = async (req, res) => {
    try {
        const { id } = req.params;

        const publisher = await db.Publisher.findByPk(id);

        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found' });
        }

        return res.status(200).json({
            message: "Get data successfully!",
            result: publisher
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};