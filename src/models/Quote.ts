import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuote extends Document {
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

const QuoteSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Quote: Model<IQuote> =
  mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
