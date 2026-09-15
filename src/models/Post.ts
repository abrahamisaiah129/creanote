import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  date: string;
  headline: string;
  sub: string;
  thumbUrl?: string;
  isFeatureBadge?: boolean;
  featureText?: string;
  page?: number;
  order: number;
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  date: { type: String, required: true },
  headline: { type: String, required: true },
  sub: { type: String, required: true },
  thumbUrl: { type: String },
  isFeatureBadge: { type: Boolean, default: false },
  featureText: { type: String },
  page: { type: Number, default: 1 },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
