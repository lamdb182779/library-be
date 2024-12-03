const Author = require('../models/author.js');

// Lấy danh sách tác giả
// exports.getAllAuthors = async (req, res) => {
//     try {
//         const authors = await Author.findAll();
//         res.render('authors', { authors });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// };

// Thêm tác giả mới
exports.createAuthor = async (req, res) => {
    const { name, image, describe } = req.body;
    if (name.trim() === "") {
        console.log("Missing author 's name!");
        return res.status(500).json({
            message: "Missing author 's name!"
        })
    }
    try {
        await Author.create({ name, image, describe });
        res.status(200).json({
            message: 'Author created successfully!',
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật tác giả
exports.updateAuthor = async (req, res) => {
    const { id, name, image, describe } = req.body;
    try {
        const updateAuthor = await Author.update({ name, image, describe }, { where: { id } });
        if(!updateAuthor){
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json({ message: 'Update successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
};

// Xóa tác giả
exports.deleteAuthor = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteAuthor = await Author.destroy({ where: { id } });
        if(!deleteAuthor){
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json({ message: 'Delete successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message});
    }  
};