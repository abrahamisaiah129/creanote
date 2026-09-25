import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuote extends Document {
  boldText: string;
  text?: string;
  bodyText: string;
  tagText: string;
  category?: string;
  caption: string;
  credit: string;
  name: string;
  author?: string;
  role: string;
  avatarUrl: string;
  bannerUrl?: string;
  imageUrl?: string;
  date?: string;
  isActive: boolean;
  createdAt: Date;
}

const QuoteSchema: Schema = new Schema({
  boldText: { type: String, required: true },
  text: { type: String },
  bodyText: { type: String, required: true },
  tagText: { type: String, default: 'QUOTE' },
  category: { type: String },
  caption: { type: String, required: true },
  credit: { type: String, default: 'CREANOTE QUOTE TIMELINE' },
  name: { type: String, required: true },
  author: { type: String },
  role: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  bannerUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  date: { type: String },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

QuoteSchema.pre('save', function (this: IQuote, next) {
  if (!this.boldText && this.text) this.boldText = this.text;
  if (!this.text && this.boldText) this.text = this.boldText;
  if (!this.author && this.name) this.author = this.name;
  if (!this.name && this.author) this.name = this.author;
  if (!this.tagText && this.category) this.tagText = this.category;
  if (!this.category && this.tagText) this.category = this.tagText;
  next();
});

QuoteSchema.index({
  name: 'text',
  author: 'text',
  boldText: 'text',
  bodyText: 'text',
  tagText: 'text',
  category: 'text',
});

export const Quote: Model<IQuote> =
  mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
