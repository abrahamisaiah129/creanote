import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeroSlide extends Document {
  imageUrl: string;
  alt: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const HeroSlideSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  alt: { type: String, default: 'Creanote Hero Slide' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const HeroSlide: Model<IHeroSlide> =
  mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
