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

    Neleri kontrol etmeliyiz? 1. username, şifre vb. gerekli olanları girdi mi? 2. şifre yeterince güçlü mü? 3. girilen username de başka bir kullanıcı var mı? 4. rol ile ilgili kontroller

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

7.  token'ı bu end pointte tanımlıyoruz
    const user = await userModel.nameeGoreBul(req.body.username);
    const payload = {
    subject: user.user_id,
    username: user.username,
    role_name: user.role_name,
    };
    const secret = JWT_SECRET;
    const options = { expiresIn: "1d" };
    let token = jwt.sign(payload, secret, options);

8.  oluşturduğumuz end pointin md lerini yazalım
    nelere bakacağız?
    Böyle bir kullanıcı var mı?
    Şifresini doğru yazmış mı?

9.  Bu end pointlerin dışında auth md de 2 kontorl daha yaparız:

    1. Giriş yapılmış mı?

    Bunu diğer end pointlerde kullanacağız
    Giriş yapmadan yapmasını istemediğimiz işlemlerin önüne yazacağız

        const tokenKontrolu = (req, res, next) => {
        const token = req.headers.authorization;

        if (token) {
        jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
            if (err) {
                res.status(401).json({ message: "Token gecersizdir" });
            } else {
                 req.decodedJWT = decodedJWT;
                console.log(req.decodedJWT);
                next();}});}
            else {
        res.status(401).json({ message: "Token gereklidir" });}};

        1. İstenen role sahip kullanıcı mı giriş yapmış?

            const sadece = (role_name) => (req, res, next) => {
            if (req.decodedJWT && req.decodedJWT.role_name == role_name) {
                next();
            }else {
                res.status(403).json({ message: "Bu, senin için değil" });}};
