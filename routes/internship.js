const express = require('express');
const multer = require('multer');
const path = require('path');
const Internship = require('../models/internship');


const router = express.Router();


// Multer storage for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


// POST /api/internship/apply
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
    const data = req.body;


    // Convert checkbox value to boolean
    const declaration = data.declaration === 'true' || data.declaration === true || data.declaration === 'on';


    const internship = new Internship({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      location: data.location,
      college: data.college,
      degree: data.degree,
      major: data.major,
      year: data.year,
      graduationYear: data.graduationYear,
      role: data.role,
      startMonthYear: data.startMonthYear,
      duration: data.duration,
      locationPref: data.locationPref,
      skills: data.skills || "",
      experience: data.experience || "",
      resume: req.file ? req.file.path : "",
      whyInternship: data.whyInternship || "",
      careerGoals: data.careerGoals || "",
      areasOfInterest: data.areasOfInterest || "",
      linkedin: data.linkedin || "",
      portfolio: data.portfolio || "",
      comments: data.comments || "",
      declaration: declaration
    });


    await internship.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(500).json({ error: "Error saving application", details: err.message });
  }
});


module.exports = router;
