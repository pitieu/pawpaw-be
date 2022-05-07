import mongoose from 'mongoose'

const photos = {
  photoUrl: { type: String },
  type: { type: Number }, // 0 photo, 1 video
}

export const commentSchema = new mongoose.Schema(
  {
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReviewService' },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    photos: [photos],
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
)

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
