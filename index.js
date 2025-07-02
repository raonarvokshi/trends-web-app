import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import news from "./routes/news.js";
import movies from "./routes/movies.js";
import crypto from "./routes/crypto.js";
import stocks from "./routes/stocks.js";
import dashboard from "./routes/dashboard.js";
import auth from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const localhost = `http://localhost:${PORT}`;
export const NewsAPIKey = process.env.NEWS_API_KEY;
export const moviesAPIKey = process.env.MOVIES_API_KEY;
export const stockMarketAPIKey = process.env.STOCK_MARKET_API_KEY;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(news);
app.use(movies);
app.use(crypto);
app.use(stocks);
app.use(dashboard);
app.use(auth);


app.get("/", verifyToken, (req, res) => {
  res.render("index.ejs", { user: req.user || null });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${localhost}`)
});