const request = require("supertest");
const server = require("./server");
const db = require("../data/db-config");

const {
  roles: initialRoles,
  sorular: initialSorular,
  users: initialUsers,
  follow: initialFollow,
  tweets: initialTweets,
  commets: initialCommets,
  favs: initialFavs,
} = require("../data/seeds/01-twitter");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

test("[0] sağlık", () => {
  expect(true).not.toBe(false);
});
