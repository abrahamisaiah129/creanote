import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITopItem extends Document {
  title: string;
  meta: string;
  badgeText?: string;
  badgeColor?: 'orange' | 'green';
  imageUrl: string;
  order: number;
  createdAt: Date;
}

const TopItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  meta: { type: String, required: true },
  badgeText: { type: String },
  badgeColor: { type: String, enum: ['orange', 'green'], default: 'orange' },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const TopItem: Model<ITopItem> =
  mongoose.models.TopItem || mongoose.model<ITopItem>('TopItem', TopItemSchema);
