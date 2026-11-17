import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  date: string;
  headline: string;
  title?: string;
  sub: string;
  excerpt?: string;
  content?: string;
  slug: string;
  postURL?: string;
  thumbUrl?: string;
  coverImage?: string;
  author?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  category?: string;
  tags?: string[];
  readTime?: string;
  isFeatureBadge?: boolean;
  featureText?: string;
  isFeatured?: boolean;
  isTopOnTheList?: boolean;
  gallery?: string[];
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  date: { type: String, required: true },
  headline: { type: String, required: true },
  title: { type: String },
  sub: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String, default: "" },
  slug: { type: String, required: true },
  postURL: { type: String, default: "" },
  thumbUrl: { type: String },
  coverImage: { type: String },
  author: { type: String, default: "Creanote Creator" },
  authorName: { type: String },
  authorRole: { type: String, default: "Creator" },
  authorAvatar: { type: String, default: "" },
  category: {
    type: String,
    required: true,
    enum: ["FEATURED", "CONVO WITH A CREATIVE", "PROJECT FEATURES"],
    default: "FEATURED",
  },
  tags: { type: [String], default: [] },
  readTime: { type: String, default: "4 min read" },
  isFeatureBadge: { type: Boolean, default: false },
  featureText: { type: String },
  isFeatured: { type: Boolean, default: false },
  isTopOnTheList: { type: Boolean, default: false },
  gallery: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// Sync aliases and generate the slug before validation, so required checks
// see the filled-in values.
PostSchema.pre("validate", function (this: IPost, next) {
  if (!this.title && this.headline) this.title = this.headline;
  if (!this.headline && this.title) this.headline = this.title;
  if (!this.excerpt && this.sub) this.excerpt = this.sub;
  if (!this.sub && this.excerpt) this.sub = this.excerpt;
  if (!this.coverImage && this.thumbUrl) this.coverImage = this.thumbUrl;
  if (!this.thumbUrl && this.coverImage) this.thumbUrl = this.coverImage;
  if (!this.author && this.authorName) this.author = this.authorName;
  if (!this.authorName && this.author) this.authorName = this.author;
  if (!this.slug && this.headline) {
    this.slug = String(this.headline)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// Unique slug index (replaces index: true on the field)
PostSchema.index({ slug: 1 }, { unique: true });

PostSchema.index({
  headline: "text",
  title: "text",
  sub: "text",
  excerpt: "text",
  content: "text",
  author: "text",
  category: "text",
});

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
