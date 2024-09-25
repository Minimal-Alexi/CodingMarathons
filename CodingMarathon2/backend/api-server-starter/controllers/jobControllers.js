const Job = require("../models/jobModel");
const mongoose = require("mongoose");

// GET /jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    if (jobs) {
      res.status(200).json(jobs);
    } else {
      res.status(404).json({ message: "No jobs found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to retrieve jobs" });
  };
};

// POST /jobs
const createJob = async (req, res) => {
  try {
    const newJob = await Job.create({ ...req.body }); // Spread the req.body object
    if (newJob) {
      res.status(201).json(newJob); // 201 Created
    } else {
      // Handle error (e.g., failed to create job)
      res.status(400).json({ message: "Invalid job data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to create job" });
  };
};

// GET /jobs/:jobId
const getJobById = async (req, res) => {
  const {jobId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const job = await Job.findById(jobId);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to retrieve job" });
  }
};

// PUT /jobs/:jobId
const updateJob = async (req, res) => {
  const {jobId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }
  try {
    const updatedJob = await Job.findOneAndUpdate(
      {_id: jobId},
      { ...req.body }, 
      {new: true, overwrite: true}
      ); // Spread the req.body object
  
    if (updatedJob) {
      res.status(200).json(updatedJob);
    } else {
      // Handle update failure (e.g., job not found)
      res.status(404).json({ message: "Job not found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error, failed to update job" });
   }

};

// DELETE /jobs/:jobId
const deleteJob = async (req, res) => {
  const {jobId} = req.params;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }
  
  const isDeleted = await Job.findOneAndDelete({_id: jobId});

  try {
    if (isDeleted) {
      res.status(204).send(); // 204 No Content
    } else {
      // Handle deletion failure (e.g., job not found)
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error, failed to delete job" });
  };
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
