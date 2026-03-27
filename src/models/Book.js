import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  isbn13: String,
  title: String,
  subtitle: String,
  authors: String,
  categories: String,
  thumbnail: String,
  description: String,
  published_year: Number,
  average_rating: Number,
  num_pages: Number,
  ratings_count: Number,
  wishlistUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  wishlistCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Book', BookSchema);
