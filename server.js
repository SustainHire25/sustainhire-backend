// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // For folder creation
require('dotenv').config(); // Load .env variables

// ⚡ CORS configuration to allow your Netlify front-end


const corsOptions = {
  origin: "https://sustainhireenterprise.netlify.app", // your Netlify frontend
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
};

app.use(cors(corsOptions));



// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create a unique folder for each user based on their email
    const emailSafe = req.body.email ? req.body.email.replace(/[@.]/g, '_') : 'anonymous';
    const folder = path.join(__dirname, 'uploads', emailSafe);
    fs.mkdirSync(folder, { recursive: true }); // Create folder if it doesn't exist
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname; // Avoid overwriting
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// --- MongoDB connection ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log(" MongoDB connected successfully"))
  .catch(err => console.error(" MongoDB connection error:", err));

// --- Schema & Model ---
const internshipSchema = new mongoose.Schema({
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

// ⚡ Force MongoDB collection name to exactly 'internship'
const Internship = mongoose.model('Internship', internshipSchema, 'internship');

// --- Routes ---
app.post('/api/internship/apply', upload.single('resume'), async (req, res) => {
  try {
    const data = req.body;

    const application = new Internship({
      ...data,
      graduationYear: Number(data.graduationYear),
      dob: new Date(data.dob),
      declaration: data.declaration === "true",
      resume: req.file ? req.file.path : ""
    });

    console.log(" Saving application:", application);

    await application.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error(" Error saving application:", err);
    res.status(500).json({ error: "Error saving application", details: err.message });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
