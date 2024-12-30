// lib/models/UserTracking.ts

import { Schema, model, models } from 'mongoose';

const CompetitorSchema = new Schema({
  name: { type: String, required: true },
  ticker: { type: String },
  domain: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' }
});

const DocumentLinksSchema = new Schema({
  sheetsUrl: { type: String },
  docsUrl: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

const UserTrackingSchema = new Schema({
  email: { type: String, required: true, unique: true },
  companyDetails: {
    name: String,
    industry: String,
    size: String,
    businessDescription: String
  },
  competitors: [CompetitorSchema],
  documentLinks: DocumentLinksSchema,
  metricPreferences: {
    financial: [String],
    engagement: [String],
    custom: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Use existing model or create new one
export const UserTracking = models.UserTracking || model('UserTracking', UserTrackingSchema);