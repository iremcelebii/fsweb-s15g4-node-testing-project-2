1.  package dosyasını oluşturalım

    npm init -y

2.  Gerekli paketleri yükleyelim

    dependencies: (npm i)

        - bcryptjs
        - express
        - jsonwebtoken
        - knex          :js formatındaki sorguları SQL formatına çevirir (npm i -g knex-->global)
        - sqlite3       :sqlite veritabanı sürücüsü

    devDependencies: (npm i -D)

        - nodemon
        - eslint      :Kodu daha düzgün yazmamızı sağlar, standartlaştırır. (npx eslint --init)
        - jwt-decode
        - jest
        - @types/jest
        - supertest
        - cross-env

3.  scripts'e komutları ekleyelim:

    "scripts": {
    "server": "nodemon index.js",
    "migrate": "knex migrate:latest",
    "rollback": "knex migrate:rollback",
    "seed": "knex seed:run",
    "test": "cross-env NODE_ENV=testing jest --verbose --runInBand",
    "resetdb": "npm run rollback && npm run migrate && npm run seed"
    },

4.  gitignore dosyasını oluşturalım

    npx gitignore node

5.  knexfile.js dosyası düzenlemeleri (knex için konfigürasyon ayarları):

    - Önce oluşturalım:
      knex init

    - production ve staging ortamları ile şu an işimiz yok, silelim

    - testing ortamı ekleyeceğiz, o yüzden development ve testing ortamı için ortak olan ayarlar için bir obje oluşturalım:

    const sharedConfig =
    {
    client: 'sqlite3',

    useNullAsDefault: true,

    migrations:{directory: './data/migrations',},

    seeds: {directory: './data/seeds',},

    pool: {afterCreate: (conn, done) => {conn.run('PRAGMA foreign_keys = ON', done)},},
    }

    - ortamları oluşturup export edelim:

    module.exports =
    {
    development: {
    ...sharedConfig,
    connection: { filename: './data/dev.db3' },
    },
    testing: {
    ...sharedConfig,
    connection: { filename: './data/testing.db3' },
    },
    }

6.  data klasörünü ve içine migrations ve seeds klasörlerini ve db-config.js dosyasını oluşturalım

7.  db-config.js dosyası düzenlemeleri:

    const knex = require("knex");
    const configs = require("../knexfile.js");
    const environment = process.env.NODE_ENV || "development";
    const db = knex(configs[environment]);
    module.exports = db;

8.  api klasörünü ve içine server.js dosyasını oluşturalım.

9.  kaç farklı route oluşturman gerekiyorsa api klasörünün içine o kadar klasör aç

10. her klasöre şimdilik bir router.js dosyası oluştur.

11. router.js dosyası düzenlemeleri: (şimdilik)

    const router = require("express").Router();

    router.get("/", (req, res, next) => {
    try {
    res.json({ message: "selam router" });
    } catch (err) {
    next(err);
    }
    });

    module.exports = router;

12. server.js dosyası düzenlemeleri:

        const express = require("express");
        const authRouter = require("./auth/auth-router.js");
        const usersRouter = require("./users/users-router.js"); //kaç router.js dosyası varsa

        const server = express();
        server.use(express.json());

        server.use("/api/auth", authRouter);
        server.use("/api/users", usersRouter);

        server.use((req, res, next) => {
            res.status(404).send("Aradığınız adres bulunamadı");
        });

        server.use((err, req, res, next) => {
            res.status(err.status || 500).json({
            message: err.message,
            stack: err.stack,
        });});

        module.exports = server;

13. index.js dosyasını oluşturalım:

    const server = require("./api/server.js");

    const PORT = process.env.PORT || 9001;

    server.listen(PORT, () => {
    console.log(`${PORT} portu dinleniyor...`);
    });

14. npm run server ile server'ı ayağa kaldırabiliriz artık.
    postman'de klasörleri ve end pointleri oluşturalım, mesajları görelim

15. migration dosyasını oluşturalım:

    knex migrate:make twitter

16. migration dosyasında tabloları oluştuyoruz

17. seed dosyasını kendimiz oluştuyoruz twitter001.js

18. seed dosyasında verileri oluştuyoruz

---

1.  end pointlere başlıyoruz

2.  yeni bir kullanıcı ekleyeceğiz. user-model.js de fonksiyonu yazalım
    create fonsiyonunu yazmadan önce genelde getbyid fonksiyonunu da yazarız

    async function idyeGoreBul(user_id) {
    const user = await db("users")
    .select("user_id", "username")
    .where("user_id", user_id)
    .first();
    return user;}

    async function ekle(user) {
    const [id] = await db("users").insert(user);
    const newUser = await idyeGoreBul(id);
    return newUser;}

3.  yeni kullanıcı bilgileri nereden gelecek? auth/register end pointinden
    router.post("/register", async (req, res, next) => {
    try {
    const newUser = await userModel.ekle(req.body);
    res.status(201).json(newUser);
    } catch (err) {
    next(err);
    }});

4.  oluşturduğumuz end pointin md lerini yazalım

5.  parolayı kriptolamamız gerek. Naıl yapacağız?
    ilk nerede parolayı alıyoruz?
    auth-router da register end pointinde

    const bcryptjs = require("bcryptjs"); -->import ettik
    router.post(
    "/register",
    authMd.sifreGecerlimi,
    authMd.usernameBostami,
    async (req, res, next) => {
    try {
    const hashedPassword = bcryptjs.hashSync(req.body.password, 12);
    const newUser = await userModel.ekle({
    username: req.body.username,
    password: hashedPassword,});
    res.status(201).json(newUser);
    } catch (err) {
    next(err);
    }});

6.  register end pointi bitti /api/auth/login 'e geçelim

7.  önce isim veritabanında kayıtlı mı diye baktık

8.  daha sonra şifre doğru mu diye baktık compareSync metoduyla

9.  şimdi giriş yapılmış mı diye bakacağız

10. npm i express-session -->session:bir kullanıcının bilgileri doğrulandıktan sonra oluşturulan oturum kaydı
11. const session=require("express-session") --> server.js'de import et
12. sessionConfig objesini oluştur
    sessionConfig = {
    name: "cikolatacips",
    secret: "bla bla",
    cookie: {
    maxAge: 1000 \* 30,
    secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    };
13. server.use(session(sessionConfig)) --> express.json()'dan sonra yaz
    login olduğum yerde (authRouter) req.session objesine giriş yapan kişinin idsini ekleyelim:

        const user = await userModel.nameeGoreBul(req.body.username);
        req.session.user_id = user.user_id;

    authMd de giriş yapılı durumda mı kontrol etmeliyim:

    async function sinirli(req, res, next) {
    try {
    if (req.session && req.session.user_id) {
    // console.log(req.session);
    // console.log(req.session.user_id);
    next();
    } else {
    next({status: 401,message: "Geçemezsiniz!",});}
    } catch (error) {
    next(error);}}

    bu md den geçmiyorsa users daki hiçbir işlemi yapamamalı o yüzden server.js de usersrouter ın önüne yazıyorum bu md yi
