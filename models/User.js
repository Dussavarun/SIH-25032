import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["tourist", "guide", "admin"],
    default: "tourist"
  },
  
  // Travel plan data structure matching the route.js transformation
  travelPlan: [
    {
      day: {
        type: Number,
        required: true,
        min: 1
      },
      destination: {
        type: String,
        required: true,
        trim: true
      },
      coordinates: {
        lat: {
          type: Number,
          required: true,
          min: -90,
          max: 90
        },
        lng: {
          type: Number,
          required: true,
          min: -180,
          max: 180
        }
      },
      hotels: [
        {
          name: {
            type: String,
            required: true,
            trim: true
          },
          coordinates: {
            lat: {
              type: Number,
              required: true,
              min: -90,
              max: 90
            },
            lng: {
              type: Number,
              required: true,
              min: -180,
              max: 180
            }
          },
          price: {
            type: String,
            default: "Contact for rates"
          }
        }
      ]
    }
  ],

  // Optional: Store last plan metadata
  lastPlanGenerated: {
    type: Date,
    default: Date.now
  },
  
  // Optional: Store plan preferences for future use
  preferences: {
    budget: Number,
    people: Number,
    preferredTransport: [String],
    interests: [String],
    origin: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ "travelPlan.day": 1 });
UserSchema.index({ lastPlanGenerated: -1 });

// Virtual to get total travel days
UserSchema.virtual('totalTravelDays').get(function() {
  return this.travelPlan.length;
});

// Method to get hotels by day
UserSchema.methods.getHotelsByDay = function(day) {
  const dayPlan = this.travelPlan.find(plan => plan.day === day);
  return dayPlan ? dayPlan.hotels : [];
};

// Method to get all destinations
UserSchema.methods.getAllDestinations = function() {
  return this.travelPlan.map(plan => ({
    day: plan.day,
    destination: plan.destination,
    coordinates: plan.coordinates
  }));
};

// Method to clear travel plan
UserSchema.methods.clearTravelPlan = function() {
  this.travelPlan = [];
  this.lastPlanGenerated = new Date();
  return this.save();
};

// Static method to find users with recent plans
UserSchema.statics.findUsersWithRecentPlans = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    lastPlanGenerated: { $gte: cutoffDate },
    travelPlan: { $exists: true, $not: { $size: 0 } }
  });
};

// Pre-save middleware to update lastPlanGenerated when travelPlan changes
UserSchema.pre('save', function(next) {
  if (this.isModified('travelPlan') && this.travelPlan.length > 0) {
    this.lastPlanGenerated = new Date();
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);