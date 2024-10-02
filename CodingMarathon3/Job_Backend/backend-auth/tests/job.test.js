const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Jobs = require("../models/jobModel");

beforeAll(async () => {
    await Jobs.deleteMany({});
    const result = await api.post("/api/jobs").send({
        title: "John Doe",
        type: "Full-time",
        description: "password123",
        company: {
            name: "name",
            contactEmail: "Male@example.com",
            contactPhone: "19900101",
        },
        location: "Inactive",
        salary: "255423",
    });
});

describe("Job API", function () {
    beforeEach(async () => {
        await Jobs.deleteMany({});
        const result = await api.post("/api/jobs").send({
            title: "John Doe",
            type: "Full-time",
            description: "password123",
            company: {
                name: "name",
                contactEmail: "Male@example.com",
                contactPhone: "19900101",
            },
            location: "Inactive",
            salary: "255423",
        })
    });

    describe("GET /jobs", () => {
        it('should return all jobs', async () => {
            console.log("entered test");

            const initialJobs = await Jobs.find({});
            const response = await api.get("/api/jobs");

            expect(response.body).toHaveLength(initialJobs.length);
        });

        it('should get one job by id', async () => {
            console.log("entered test")

            const job = await Jobs.findOne();

            console.log(job)

            await api
                .get("/api/jobs/" + job._id)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        })
    })

    describe("POST /jobs", () => {
        it('should create a new job', async () => {
            console.log("entered test")

            const newJob = {
                title: "job",
                type: "Full-time",
                description: "description",
                company: {
                    name: "name",
                    contactEmail: "email@email.email",
                    contactPhone: "1234567",
                },
                location: "location",
                salary: 1234567,
            };

            const response = await api
                .post("/api/jobs")
                .send(newJob)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        });
    });

    describe("PUT /jobs", () => {
        it('should update job by id', async () => {
            const job = await Jobs.findOne();
            const updatedJob = {
                type: "Lmao",
                description: "Bad",
            };

            const response = await api
                .put(`/api/jobs/${job._id}`)
                .send(updatedJob)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            console.log("Response body:", response.body);

            const updatedjobCheck = await Jobs.findById(job._id);
            console.log("Updated job:", updatedjobCheck);

            expect(updatedjobCheck.type).toBe(updatedJob.type);
            expect(updatedjobCheck.description).toBe(updatedJob.description);
        })
    })

    describe("Delete /jobs", () => {
        it('should delete job by id', async () => {
            const job = await Jobs.findOne();
            await api
                .delete(`/api/jobs/${job._id}`)
                .expect(204)
            const jobCheck = await Jobs.findById(job._id);
            expect(jobCheck).toBeNull();
        })
    })
})