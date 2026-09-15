import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuote extends Document {
  boldText: string;
  bodyText: string;
  tagText: string;
  caption: string;
  credit: string;
  name: string;
  role: string;
  avatarUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

const QuoteSchema: Schema = new Schema({
  boldText: { type: String, required: true },
  bodyText: { type: String, required: true },
  tagText: { type: String, default: 'QUOTE' },
  caption: { type: String, required: true },
  credit: { type: String, default: 'CREANOTE QUOTE TIMELINE' },
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Quote: Model<IQuote> =
  mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
