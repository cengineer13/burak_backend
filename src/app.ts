import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { T } from "./libs/types/common";

import cookieParser from "cookie-parser";

const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

// 1 - Kirish
const app = express();
// console.log("dirname", __dirname)
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

// 2 - Sessions

// 2.1 - Session-coockie orqali
app.use(
  session({
    secret: String(process.env.SESSION_SECRET), // Session qurishda ishlatiladigan loyiha kodi
    cookie: {
      //doli //soat  //3    // 60,000 = 1 minut
      maxAge: 1000 * 3600 * 6, // session 6 soat davomida aktiv bo'ladi-
    },
    store: store, // sessionnni mongo db ga saqlashni korsatilyapti mongodb-session obyekti orqali
    resave: true, // true da - session tugash vaqti yangilanadi. qachon kirilsa shunda boshlab hisoblanadi
    saveUninitialized: true, // false  bolsa - faqat login bolganda DB ga session yoziladi. true -da bosh bolsa ham yoziladi
  }),
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  //res.locals - browser variable
  res.locals.member = sessionInstance.member;
  next();
});

// 2.1 JWT TOken orqali Sessions
app.use(cookieParser());

// 3- Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 4 - Routers
app.use("/admin", routerAdmin); // SSR: EJS
app.use("/", router); // SPA: React

export default app;
