const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Jobs = require("../models/jobModel");
const User = require("../models/userModel");

const Job = [{
        title: "Helsinki in 5 Days Job",
        type: "Full-Time",
        description: "https://www.course-api.com/images/Jobs/Job-1.jpeg",
        company: {
            name: "1900",
            contactEmail: "company1@company1.company1",
            contactPhone: "1234567"
        }
    },
    {
        title: "London in 7 Days Job",
        type: "Full-Time",
        description: "https://www.course-api.com/images/Jobs/Job-2.jpeg",
        company: {
            name: "2195",
            contactEmail: "company2@company2.company2",
            contactPhone: "7654321"
        }
    },
];

let token = null;

beforeAll(async () => {
    await User.deleteMany({});
    const result = await api.post("/api/users/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone_number: "1234567890",
        gender: "Male",
        date_of_birth: "1990-01-01",
        membership_status: "Inactive",
    });
    token = result.body.token;
});

describe("Given there are initially some jobs saved", () => {
    beforeEach(async () => {
        await Jobs.deleteMany({});
        await Promise.all([
            api
                .post("/api/jobs")
                .set("Authorization", "bearer " + token)
                .send(Job[0]),
            api
                .post("/api/jobs")
                .set("Authorization", "bearer " + token)
                .send(Job[1]),
        ]);
    });

    it("should return all jobs as JSON when GET /api/jobs is called", async () => {
        await api
            .get("/api/jobs")
            .set("Authorization", "bearer " + token)
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    it("should create one job when POST /api/jobs is called", async () => {
        const newJob = {
            title: "Programmer",
            type: "IT",
            description: "Beep boop robot",
            company: {
                name: "The IT HQ",
                contactEmail: "Evilinc@company1.company1",
                contactPhone: "6666666666"
            }
        };
        await api
            .post("/api/jobs")
            .set("Authorization", "bearer " + token)
            .send(newJob)
            .expect(201);
    });

    it("should return one job by ID when GET /api/jobs/:id is called", async () => {
        const job = await Jobs.findOne();
        await api
            .get("/api/jobs/" + job._id)
            .set("Authorization", "bearer " + token)
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    it("should update one job by ID when PUT /api/jobs/:id is called", async () => {
        const job = await Jobs.findOne();
        const updatedjob = {
            type: "Lmao",
            description: "Bad",
        };
        const response = await api
            .put(`/api/jobs/${job._id}`)
            .set("Authorization", "bearer " + token)
            .send(updatedjob)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        console.log("Response body:", response.body);

        const updatedjobCheck = await Jobs.findById(job._id);
        console.log("Updated job:", updatedjobCheck);

        expect(updatedjobCheck.info).toBe(updatedjob.info);
        expect(updatedjobCheck.price).toBe(updatedjob.price);
    });


    it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
        const job = await Jobs.findOne();
        await api
            .delete("/api/jobs/" + job._id)
            .set("Authorization", "bearer " + token)
            .expect(204);
        const jobCheck = await Jobs.findById(job._id);
        expect(jobCheck).toBeNull();
    });
});

afterAll(() => {
    mongoose.connection.close();
});
