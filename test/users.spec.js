const app = require('../src/app');
const { getTestUsers } = require("./helper.js");
const knex = require('knex');

describe(`Users Router from moodi_users `, function() {
    let db;
    const testUsers = getTestUsers();
    
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
        return db.raw("ALTER TABLE moodi_users DISABLE TRIGGER ALL;")
    });

    afterEach(() => {
        return db.raw("ALTER TABLE moodi_users  ENABLE TRIGGER ALL;")
    });
 
    describe(`Users when table is populated`, () => {

        beforeEach(() => {
            return db.into('moodi_users')
                .insert(testUsers)
        });

        it(`fetches all users`, () => {
            return supertest(app)
                .get('/api/users')
                .expect(200, testUsers)
        });

        it(`deletes valid user`, () => {
            const userToDelete = testUsers[0];
            const remainingUser = [testUsers[1]];
            return supertest(app)
                .delete(`/api/users/${userToDelete.id}`)
                .expect(204, {})
                .then(res => {
                    supertest(app)
                        .get('/api/users')
                        .expect(200, remainingUser)
                });
        });

        it(`tries to delete non-existent user`, () => {
            return supertest(app)
                .delete(`/api/users/99`)
                .expect(404, {
                    error: { message: `User doesn't exist` }
                });
        });

        it(`fetches specific user`, () => {
            const userToFetch = testUsers[0];
            return supertest(app)
                .get(`/api/users/${userToFetch.id}`)
                .expect(200, userToFetch)
        });

        it(`tries to fetch non-existent user`, () => {
            return supertest(app)
            .get(`/api/users/99`)
            .expect(404, {
                error: { message: `User doesn't exist` }
            });
        });

        it(`patches user with valid field`, () => {
            const userToPatch = testUsers[0];
            const newName = "New Name";
            const expected = {...userToPatch, first_name: newName }
            const newFields = {first_name: newName};
            return supertest(app)
            .patch(`/api/users/${userToPatch.id}`)
            .send(newFields)
            .expect(204)
            .then(() => {
                supertest(app)
                .get(`/api/users/${userToPatch.id}`)
                .then(res => {
                    expect(res.body).to.eql(expected)
                });
            });
        });

        it(`tries to patch user with invalid fields`, () => {
            const userToPatch = testUsers[0];
            const newFields = {invalid: "invalid field"};
            return supertest(app)
            .patch(`/api/users/${userToPatch.id}`)
            .expect(400, {
                error: { message: "Request body must contain at least either 'first_name', 'last_name', 'email', 'password' or 'ranking'" }
            });
        });
    });
    
    describe(`Users when moodi_users table is empty`, () => {

        it(`returns empty list when table is empty`, () => {
            return supertest(app)
                .get('/api/users')
                .expect(200, [])
        });

        it(`posts valid user`, () => {
            const newUser = testUsers[0];
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.id).to.eql(newUser.id)
                    expect(res.body.first_name).to.eql(newUser.first_name)
                    expect(res.body.last_name).to.eql(newUser.last_name)
                    expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                })
                .then(res =>
                supertest(app)
                    .get(`/api/users/${res.body.id}`)
                    .expect(res.body)
                )
        });
        it(`posts invalid user entry`, () => {
            const invalidUser = {id:4};
            return supertest(app)
                .post('/api/users')
                .send(invalidUser)
                .expect(400)
        });
    });
});
