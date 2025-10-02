const mongoose = require('mongoose');


const InternshipSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  location: { type: String, required: true },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  major: { type: String, required: true },
  year: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  role: { type: String, required: true },
  startMonthYear: { type: String, required: true },
  duration: { type: String, required: true },
  locationPref: { type: String, required: true },
  skills: { type: String },
  experience: { type: String },
  resume: { type: String, required: true },
  whyInternship: { type: String },
  careerGoals: { type: String },
  areasOfInterest: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  comments: { type: String },
  declaration: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Internship', InternshipSchema);
