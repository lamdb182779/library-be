const db = require('../models');
const { Op, fn, col, literal } = require("sequelize")

// Thêm sách
exports.addBook = async (req, res) => {
    try {
        // Kiểm tra xem name có được cung cấp và hợp lệ hay không
        if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
            console.log('db.Book name must be valid');
            return res.status(400).json({ message: 'Tên sách không hợp lệ!' });
        }

        const { name, publisherId, image, describe, quantity, authorIds, positionIds, tagIds } = req.body

        if (quantity < 1) return res.status(500).json({ message: 'Số lượng sách không hợp lệ!' })

        if (!Array.isArray(authorIds)) {
            return res.status(500).json({ message: 'Danh sách tác giả không hợp lệ!' });
        }

        if (!Array.isArray(tagIds)) {
            return res.status(500).json({ message: 'Danh sách thể loại không hợp lệ!' });
        }

        if (!Array.isArray(positionIds)) {
            return res.status(500).json({ message: 'Danh sách vị trí không hợp lệ!' });
        }

        const newBook = await db.Book.create({
            name,
            publisherId: publisherId,
            image,
            describe,
            quantity
        });

        for (const authorId of authorIds) {
            await db.BookAuthor.create({
                bookId: newBook.id,
                authorId,
            })
        }

        for (const positionId of positionIds) {
            await db.BookPosition.create({
                bookId: newBook.id,
                positionId,
            })
        }

        for (const tagId of tagIds) {
            await db.BookTag.create({
                bookId: newBook.id,
                tagId,
            })
        }

        return res.status(201).json({ message: 'Thêm mới sách thành công', book: newBook });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Xóa sách
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem sách với `id` có tồn tại không
        const book = await db.Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Xóa sách
        await book.destroy();

        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Cập nhật sách
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params
        const { name, publisherId, image, describe, quantity, authorIds, positionIds, tagIds } = req.body
        const book = await db.Book.findByPk(id, {
            include: [
                {
                    model: db.Author,
                    attributes: ['id'],
                    through: { attributes: [] },
                },
                {
                    model: db.Position,
                    attributes: ['id'],
                    through: { attributes: [] },
                },
                {
                    model: db.Tag,
                    attributes: ['id'],
                    through: { attributes: [] },
                },
            ]
        });

        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy mã sách!' });
        }

        if (quantity < 1) return res.status(500).json({ message: 'Số lượng sách không hợp lệ!' })

        if (!Array.isArray(authorIds)) {
            return res.status(500).json({ message: 'Danh sách tác giả không hợp lệ!' });
        }

        if (!Array.isArray(tagIds)) {
            return res.status(500).json({ message: 'Danh sách thể loại không hợp lệ!' });
        }

        if (!Array.isArray(positionIds)) {
            return res.status(500).json({ message: 'Danh sách vị trí không hợp lệ!' });
        }

        // Kiểm tra tính hợp lệ của tên nếu có
        if (name && (typeof name !== 'string' || name.trim() === '')) {
            return res.status(400).json({ message: 'Book name must be a valid, non-empty string' });
        }

        // Cập nhật thông tin mới cho sách
        book.name = name || book.name;
        book.publisherId = publisherId || book.publisherId;
        book.image = image || book.image;
        book.describe = describe || book.describe;
        book.quantity = quantity || book.quantity;

        await book.save();

        const curAuthorIds = book.Authors.map(item => item.id)
        const curTagIds = book.Tags.map(item => item.id)
        const curPositionIds = book.Positions.map(item => item.id)

        const authorsToDelete = curAuthorIds.filter(id => !authorIds.includes(id));

        if (authorsToDelete.length > 0) {
            await db.BookAuthor.destroy({
                where: {
                    authorId: { [Op.in]: authorsToDelete },
                    bookId: book.id,
                }
            });
        }

        const authorsToAdd = authorIds.filter(id => !curAuthorIds.includes(id));

        for (const authorId of authorsToAdd) {
            await db.BookAuthor.create({
                bookId: book.id,
                authorId,
            });
        }

        const tagsToDelete = curTagIds.filter(id => !tagIds.includes(id));
        if (tagsToDelete.length > 0) {
            await db.BookTag.destroy({
                where: {
                    tagId: { [Op.in]: tagsToDelete },
                    bookId: book.id,
                }
            });
        }

        const positionsToDelete = curPositionIds.filter(id => !positionIds.includes(id));
        if (positionsToDelete.length > 0) {
            await db.BookPosition.destroy({
                where: {
                    positionId: { [Op.in]: positionsToDelete },
                    bookId: book.id,
                }
            });
        }

        const tagsToAdd = tagIds.filter(id => !curTagIds.includes(id));
        for (const tagId of tagsToAdd) {
            await db.BookTag.create({
                bookId: book.id,
                tagId,
            });
        }

        const positionsToAdd = positionIds.filter(id => !curPositionIds.includes(id));
        for (const positionId of positionsToAdd) {
            await db.BookPosition.create({
                bookId: book.id,
                positionId,
            });
        }


        // Trả về phản hồi thành công với thông tin sách cập nhật
        return res.status(200).json({ message: 'Cập nhật sách thành công!', book });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Lấy thông tin sách theo ID hoặc tất cả nếu không có ID, hỗ trợ phân trang
exports.getBooks = async (req, res) => {
    try {
        let { page = 1, pagesize = 10, keyword = "", type = "name" } = req.query;

        page = parseInt(page) || 1
        pagesize = parseInt(pagesize) || 10
        pagesize = pagesize > 25 ? 25 : pagesize
        type = type || "name"
        let where = { name: { [Op.iLike]: `%${keyword.trim()}%` } }
        const condition = (t) => (keyword?.trim() && type === t) ? where : {}

        let skip = (page - 1) * pagesize
        let { count, rows } = await db.Book.findAndCountAll({
            distinct: true,
            where: condition("name"),
            limit: pagesize,
            offset: skip,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
                include: [
                    [
                        literal(`(
                        SELECT COUNT(*)
                        FROM "BookReaders"
                        WHERE "BookReaders"."isReturned" = false
                        AND "BookReaders"."bookId" = "Book"."id"
                        )`), "borrowCount"
                    ]
                ]
            },
            include: [
                {
                    model: db.Publisher,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Author,
                    where: condition("author"),
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Position,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Tag,
                    where: condition("tag"),
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.User,
                    attributes: [],
                    through: { attributes: [] },
                },
            ],
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

exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await db.Book.findByPk(id, {
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
                include: [
                    [
                        literal(`(
                        SELECT COUNT(*)
                        FROM "BookReaders"
                        WHERE "BookReaders"."isReturned" = false
                        AND "BookReaders"."bookId" = "Book"."id"
                        )`), "borrowCount"
                    ]
                ]
            },
            include: [
                {
                    model: db.Publisher,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Author,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Position,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Tag,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.User,
                    attributes: [],
                    through: { attributes: [] },
                },
            ]
        })

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({
            message: "Get data successfully!",
            result: book
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.userGetBooks = async (req, res) => {
    try {
        let { page = 1, pagesize = 10, keyword = "", type = "name" } = req.query;

        page = parseInt(page) || 1
        pagesize = parseInt(pagesize) || 10
        pagesize = pagesize > 25 ? 25 : pagesize
        type = type || "name"
        let where = { name: { [Op.iLike]: `%${keyword.trim()}%` } }
        const condition = (t) => (keyword?.trim() && type === t) ? where : {}

        let skip = (page - 1) * pagesize
        let { count, rows } = await db.Book.findAndCountAll({
            distinct: true,
            where: condition("name"),
            limit: pagesize,
            offset: skip,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
                include: [
                    [
                        literal(`(
                        SELECT COUNT(*)
                        FROM "BookReaders"
                        WHERE "BookReaders"."isReturned" = false
                        )`), "borrowCount"
                    ]
                ]
            },
            include: [
                {
                    model: db.Publisher,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Author,
                    where: condition("author"),
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Position,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Tag,
                    where: condition("tag"),
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.User,
                    attributes: [],
                    through: { attributes: [] },
                },
            ],
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

exports.userGetBookById = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await db.Book.findByPk(id, {
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
                include: [
                    [
                        literal(`(
                        SELECT COUNT(*)
                        FROM "BookReaders"
                        WHERE "BookReaders"."isReturned" = false
                        )`), "borrowCount"
                    ]
                ]
            },
            include: [
                {
                    model: db.Publisher,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Author,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Position,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.Tag,
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.User,
                    attributes: [],
                    through: { attributes: [] },
                },
            ]
        })

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({
            message: "Get data successfully!",
            result: book
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};