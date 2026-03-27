import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image);

    const newBook = new Book({
      title,
      caption,
      rating,
      image: uploadResponse.secure_url,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.log('Create book error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ===============================
// 📚 GET ALL BOOKS (DATASET + USER)
// ===============================
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();

    res.json({
      books,
      currentPage: page,
      totalBooks: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log('Fetch books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;

    const books = await Book.find({
      title: { $regex: query, $options: 'i' },
    }).limit(20);

    res.json(books);
  } catch (error) {
    console.log('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

router.get('/user', protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(books);
  } catch (error) {
    console.log('User books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.user?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // delete image from cloudinary
    if (book.image && book.image.includes('cloudinary')) {
      try {
        const publicId = book.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log('Cloudinary delete error:', err);
      }
    }

    await book.deleteOne();

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.log('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
