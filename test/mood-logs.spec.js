const app = require('../src/app');
const { getTestMoodLogs } = require("./helper.js");
const knex = require('knex');

describe(`Mood logs Router from moodi_mood_logs `, function() {
    let db;
    const testMoodLogs = getTestMoodLogs();
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db);
    });

    beforeEach('Clean the table', () => db.raw('TRUNCATE moodi_users, moodi_mood_logs RESTART IDENTITY CASCADE'));

    after(() => db.destroy());

    beforeEach(() => {
        return db.raw("ALTER TABLE moodi_mood_logs DISABLE TRIGGER ALL;")
    });

    afterEach(() => {
        return db.raw("ALTER TABLE moodi_mood_logs  ENABLE TRIGGER ALL;")
    });
 
    describe(`MoodLogs when table is populated`, () => {

        beforeEach(() => {
            return db.into('moodi_mood_logs')
                .insert(testMoodLogs)
        });

        it(`fetches all moodLogs`, () => {
            return supertest(app)
                .get('/api/mood-logs')
                .expect(200, testMoodLogs)
        });

        it(`deletes valid moodLog`, () => {
            const moodLogToDelete = testMoodLogs[0];
            const remainingMoodLog = [testMoodLogs[1]];
            return supertest(app)
                .delete(`/api/mood-logs/${moodLogToDelete.id}`)
                .expect(204, {})
                .then(res => {
                    supertest(app)
                        .get('/api/mood-logs')
                        .expect(200, remainingMoodLog)
                });
        });

        it(`tries to delete non-existent moodLog`, () => {
            return supertest(app)
                .delete(`/api/mood-logs/99`)
                .expect(404, {
                    error: { message: `Mood log doesn't exist` }
                });
        });

        it(`fetches specific moodLog`, () => {
            const moodLogToFetch = testMoodLogs[0];
            return supertest(app)
                .get(`/api/mood-logs/${moodLogToFetch.id}`)
                .expect(200, moodLogToFetch)
        });

        it(`tries to fetch non-existent moodLog`, () => {
            return supertest(app)
            .get(`/api/mood-logs/99`)
            .expect(404, {
                error: { message: `Mood log doesn't exist` }
            });
        });

        it(`patches moodLog with valid field`, () => {
            const moodLogToPatch = testMoodLogs[0];
            const newMood = "New Mood";
            const expected = {...moodLogToPatch, mood: newMood }
            const newFields = {mood: newMood};
            return supertest(app)
            .patch(`/api/mood-logs/${moodLogToPatch.id}`)
            .send(newFields)
            .expect(204)
            .then(() => {
                supertest(app)
                .get(`/api/mood-logs/${moodLogToPatch.id}`)
                .then(res => {
                    expect(res.body).to.eql(expected)
                });
            });
        });

        it(`tries to patch moodLog with invalid fields`, () => {
            const moodLogToPatch = testMoodLogs[0];
            const newFields = {invalid: "invalid field"};
            return supertest(app)
            .patch(`/api/mood-logs/${moodLogToPatch.id}`)
            .expect(400, {
                error: { message: "Request body must contain at least either 'mood', 'activities', 'notes', 'title', 'start_date', 'end_date' or 'sleep_hours'" }
            });
        });
    });
    
    describe(`MoodLogs when moodi_mood_logs table is empty`, () => {

        it(`returns empty list when table is empty`, () => {
            return supertest(app)
                .get('/api/mood-logs')
                .expect(200, [])
        });

        it(`posts valid moodLog`, () => {
            const newMoodLog = testMoodLogs[0];
            return supertest(app)
                .post('/api/mood-logs')
                .send(newMoodLog)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.eql(newMoodLog.id)
                    expect(res.body.first_name).to.eql(newMoodLog.first_name)
                    expect(res.body.last_name).to.eql(newMoodLog.last_name)
                    expect(res.headers.location).to.eql(`/api/mood-logs/${res.body.id}`)
                })
                .then(res =>
                supertest(app)
                    .get(`/api/mood-logs/${res.body.id}`)
                    .expect(res.body)
                )
        });
        it(`posts invalid moodLog entry`, () => {
            const invalidMoodLog = {id:4};
            return supertest(app)
                .post('/api/mood-logs')
                .send(invalidMoodLog)
                .expect(400)
        });
    });
});
