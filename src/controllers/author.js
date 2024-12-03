const db = require('../models');
const { Op } = require("sequelize")

//Thêm tác giả
exports.addAuthor = async (req, res) => {
    try {
        // Kiểm tra xem name có được cung cấp và hợp lệ hay không
        if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
            console.log('Author name must be a valid');
            return res.status(400).json({ message: 'Tên tác giả không hợp lệ!' });
        }

        const { name, image, describe } = req.body;

        const newAuthor = await db.Author.create({
            name,
            image,
            describe
        });

        return res.status(201).json({ message: 'Author created successfully', author: newAuthor });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

//Xóa tác giả
exports.deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem tác giả với `id` có tồn tại không
        const author = await db.Author.findByPk(id);

        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        // Xóa tác giả
        await author.destroy();

        return res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

//Cập nhật tác giả
exports.updateAuthor = async (req, res) => {
    try {
        const { name, image, describe } = req.body
        const { id } = req.params;
        if (!id) return res.status(404).json({ message: 'Chưa truyền vào thông tin!' })

        const author = await db.Author.findByPk(id);

        if (!author) {
            return res.status(404).json({ message: 'Không tìm thấy tác giả!' });
        }

        // Kiểm tra tính hợp lệ của tên nếu có
        if (name && (typeof name !== 'string' || name.trim() === '')) {
            return res.status(400).json({ message: 'Tên tác giả không hợp lệ!' });
        }

        // Cập nhật thông tin mới cho tác giả
        author.name = name || author.name;
        author.image = image || author.image;
        author.describe = describe || author.describe;

        await author.save();

        return res.status(200).json({ message: 'Author updated successfully', author })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" })
    }
};

// Lấy thông tin tác giả theo ID hoặc tất cả nếu không có ID
exports.getAuthors = async (req, res) => {
    try {
        let { page = 1, pagesize = 10, keyword = "" } = req.query;


        page = parseInt(page) || 1
        pagesize = parseInt(pagesize) || 10
        pagesize = pagesize > 25 ? 25 : pagesize

        let skip = (page - 1) * pagesize
        let { count, rows } = await db.Author.findAndCountAll({
            where: { name: { [Op.iLike]: `%${keyword.trim()}%` } },
            limit: pagesize,
            offset: skip,
            attributes: ["id", "image", "name", "describe"]
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

exports.getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;

        const author = await db.Author.findByPk(id, {
            include: [
                {
                    model: db.Book,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
            ]
        });

        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        return res.status(200).json({
            message: "Get data successfully!",
            result: author
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};