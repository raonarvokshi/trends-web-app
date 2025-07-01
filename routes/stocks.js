import express from "express";
import axios from "axios";
import { stockMarketAPIKey } from "../index.js";
import { authenticateToken } from "../middleware/middleware.js";


const router = express.Router();

router.get("/stocks", async (req, res) => {
  const selectedSymbol = req.query.symbol || "AAPL";
  const stockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "NFLX", "INTC", "BABA"];
  try {
    const response = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: selectedSymbol,
        apikey: stockMarketAPIKey
      }
    });
    const quote = response.data["Global Quote"];
    res.render("stock/stocks.ejs", { quote, stockSymbols, selectedSymbol });
  } catch (err) {
    res.render("stock/stocks.ejs", { quote: null, stockSymbols, selectedSymbol, error: "Failed to fetch stock data" });
  }
});

export default router;