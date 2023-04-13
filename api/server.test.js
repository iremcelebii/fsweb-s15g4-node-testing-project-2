const request = require("supertest");
const server = require("./server");
const db = require("../data/db-config");
const bcrypt = require("bcryptjs");
const jwtDecode = require("jwt-decode");

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

describe("[POST] /api/auth/login", () => {
  it("[1] geçerli kriterlerde doğru mesajı döndürüyor", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "1234" });
    expect(res.body.message).toMatch(/Hoşgeldin bob/i);
  }, 750);

  it("[2] kullanıcı adı veya şifre yanlışsa doğru hata mesajı", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bobsy", password: "1234" });
    expect(res.body.message).toMatch(/Kullanıcı adı veya şifre yanlış/i);
    expect(res.status).toBe(401);
    res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "12345" });
    expect(res.body.message).toMatch(/Kullanıcı adı veya şifre yanlış/i);
    expect(res.status).toBe(401);
  }, 750);

  it("[2] kriterler geçersizse doğru mesaj ve durum kodu", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bobsy", password: "1234" });
    expect(res.body.message).toMatch(/Kullanıcı adı veya şifre yanlış/i);
    expect(res.status).toBe(401);
    res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "12345" });
    expect(res.body.message).toMatch(/Kullanıcı adı veya şifre yanlış/i);
    expect(res.status).toBe(401);
  }, 750);

  it("[3] doğru token ve { user_id, username, role_name, exp, iat } ile yanıtlıyor", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "1234" });
    let decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toMatchObject({
      user_id: 1,
      role_name: "admin",
      username: "bob",
    });
    res = await request(server)
      .post("/api/auth/login")
      .send({ username: "irem", password: "1234" });
    decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toMatchObject({
      user_id: 2,
      role_name: "user",
      username: "irem",
    });
  }, 750);
});

describe("[POST] /api/auth/register", () => {
  it("[4] yeni kullanıcı veritabanına kaydediliyor", async () => {
    await request(server).post("/api/auth/register").send({
      username: "yeniKullanici",
      password: "yeniKullanici1234",
      soru_id: "1",
      soru_cevap: "deneme",
    });
    const yeniKullanici = await db("users")
      .where("username", "yeniKullanici")
      .first();
    expect(yeniKullanici).toMatchObject({
      role_id: 2,
      username: "yeniKullanici",
    });
  }, 750);

  it("[5] kullanıcı kaydı başarılıysa doğru status kodu  ve body", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "yeniKullanici",
      password: "yeniKullanici1234",
      soru_id: "1",
      soru_cevap: "deneme",
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      username: "yeniKullanici",
      role_name: "user",
    });
  }, 750);

  it("[6] kullanıcı adı yoksa doğru hata mesajı", async () => {
    const res = await request(server).post("/api/auth/register").send({
      password: "yeniKullanici1234",
      soru_id: "1",
      soru_cevap: "deneme",
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Lütfen bir kullanıcı adı giriniz/i);
  }, 750);
  it("[7] şifre yoksa doğru hata mesajı", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "yeniKullanici",
      soru_id: "1",
      soru_cevap: "deneme",
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Lütfen bir şifre giriniz/i);
  }, 750);

  it("[8] güvenlik sorusu yoksa doğru hata mesajı", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "yeniKullanici",
      password: "yeniKullanici1234",
      soru_cevap: "deneme",
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Lütfen bir güvenlik sorusu seçiniz/i);
  }, 750);
  it("[9] güvenlik sorusu cevabı yoksa doğru hata mesajı", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "yeniKullanici",
      password: "yeniKullanici1234",
      soru_id: "1",
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Lütfen güvenlik sorusunu cevaplayınız/i);
  }, 750);

  it("[9] kayıtlı bir username seçilirse doğru hata mesajı", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "bob",
      password: "yeniKullanici1234",
      soru_id: "1",
      soru_cevap: "deneme",
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Username kullaniliyor/i);
  }, 750);

  it("[10] şifre kısaysa doğru hata mesajı", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "yeniKullanici",
      password: "yeni",
      soru_id: "1",
      soru_cevap: "deneme",
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Şifre en az 8 karakterden oluşmalı/i);
  }, 750);

  it("[10] şifrede rakam yoksa doğru hata mesajı", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "yeniKullanici",
      password: "yeniyeni",
      soru_id: "1",
      soru_cevap: "deneme",
    });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/Şifre en az 1 rakam içermeli/i);
  }, 750);
  it("[11] şifre düz metin yerine kriptolu bir şekilde kaydediliyor", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({
        username: "yeniKullanici",
        password: "yeniKullanici1234",
        soru_id: "1",
        soru_cevap: "deneme",
      });
    const yeniKullanici = await db("users")
      .where("username", "yeniKullanici")
      .first();
    expect(
      bcrypt.compareSync("yeniKullanici1234", yeniKullanici.password)
    ).toBeTruthy();
  }, 750);
});
