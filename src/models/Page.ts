import mongoose, { Document, Schema } from 'mongoose';

export interface ISeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  seo: ISeoMeta;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SeoMetaSchema = new Schema<ISeoMeta>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String }],
  ogTitle: { type: String },
  ogDescription: { type: String },
  ogImage: { type: String },
  canonicalUrl: { type: String },
}, { _id: false });

const PageSchema = new Schema<IPage>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    featuredImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    seo: {
      type: SeoMetaSchema,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PageSchema.index({ status: 1 });
PageSchema.index({ createdBy: 1 });
PageSchema.index({ createdAt: -1 });

export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

