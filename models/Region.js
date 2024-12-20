import mongoose from 'mongoose';

// Locality Schema
const localitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  description: { type: String, required: true }, // Added description field
  subscriptions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      subscribedAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

// City Schema
const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true },
  // description: { type: String, required: true }, // Added description field
  subscriptions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      subscribedAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

// District Schema
const districtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  // description: { type: String, required: true }, // Added description field
  subscriptions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      subscribedAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

// State Schema
const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  // description: { type: String, required: true }, // Added description field
  subscriptions: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      subscribedAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

// Models
const State = mongoose.model('State', stateSchema);
const District = mongoose.model('District', districtSchema);
const City = mongoose.model('City', citySchema);
const Locality = mongoose.model('Locality', localitySchema);

export { State, District, City, Locality };
