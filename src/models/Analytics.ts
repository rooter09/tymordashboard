import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  pageUrl: string;
  pageTitle: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  visitDate: Date;
  sessionId?: string;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    pageUrl: {
      type: String,
      required: true,
    },
    pageTitle: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    device: {
      type: String,
    },
    browser: {
      type: String,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    sessionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AnalyticsSchema.index({ pageUrl: 1 });
AnalyticsSchema.index({ visitDate: -1 });
AnalyticsSchema.index({ createdAt: -1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

