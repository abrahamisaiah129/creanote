import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuote extends Document {
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  quoteText?: string;
  name?: string;
  avatarUrl?: string;
  meaning?: string;
}

const QuoteSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  quoteText: { type: String, default: '' },
  name: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  meaning: { type: String, default: '' },
});

export const Quote: Model<IQuote> =
  mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
