import express from "express";
import axios from "axios";
import { NewsAPIKey } from "../index.js";
import { moviesAPIKey } from "../index.js";
import { stockMarketAPIKey } from "../index.js";

const router = express.Router();


router.get("/dashboard", async (req, res) => {
  try {
    const [newsRes, movieRes, cryptoRes, stockRes] = await Promise.all([
      axios.get(`https://newsapi.org/v2/top-headlines`, {
        params: { country: "us", apiKey: NewsAPIKey },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${moviesAPIKey}`),
      axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: "usd",
          ids: "bitcoin",
        },
      }),
      axios.get("https://www.alphavantage.co/query", {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: "TSLA",
          apikey: stockMarketAPIKey,
        },
      }),
    ]);

    const topNews = newsRes.data.articles[0]?.source?.name || "N/A";
    const topMovie = movieRes.data.results[0]?.title || "N/A";
    const bitcoinPrice = cryptoRes.data[0]?.current_price || "N/A";
    const tslaChange = stockRes.data["Global Quote"]["10. change percent"] || "N/A";

    res.render("dashboard/dashboard.ejs", {
      topNews,
      topMovie,
      bitcoinPrice,
      tslaChange,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).send("Failed to load dashboard");
  }
});

export default router;