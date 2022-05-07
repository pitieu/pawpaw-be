import mongoose from 'mongoose'

export const commentSchema = new mongoose.Schema(
  {
    commenterId: { type: User },
    comment: { type: String },
    photos: [photos],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    children: [reviewId],
  },
  { timestamps: true },
)

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
