import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeroSlide extends Document {
  imageUrl: string;
  mobileImageUrl?: string;
  alt: string;
  title?: string;
  meta?: string;
  badgeText?: string;
  headline?: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const HeroSlideSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  mobileImageUrl: { type: String, default: '' },
  alt: { type: String, default: 'Creanote Hero Slide' },
  title: { type: String, default: '' },
  meta: { type: String, default: '' },
  badgeText: { type: String, default: '' },
  headline: { type: String, default: '' },
  linkUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const HeroSlide: Model<IHeroSlide> =
  mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
