const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require("../controllers/jobControllers");
const auth = require("../middleware/requireAuth");

router.get("/", getAllJobs);
router.get("/:jobId", getJobById);
router.use(auth);
router.post("/", createJob);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);

module.exports = router;