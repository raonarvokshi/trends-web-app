import express from "express";
import axios from "axios";
import { authenticateToken } from "../middleware/middleware.js";

const router = express.Router();

router.get("/crypto", async (req, res) => {
  let cryptoCache = null;
  let lastFetched = 0;
  const CACHE_DURATION = 60 * 1000;
  const now = Date.now();

  if (cryptoCache && (now - lastFetched) < CACHE_DURATION) {
    return res.render("crypto/crypto.ejs", { topCryptos: cryptoCache });
  }

  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false
      }
    });

    cryptoCache = response.data;
    lastFetched = now;

    res.render("crypto/crypto.ejs", { topCryptos: cryptoCache });

  } catch (error) {
    console.error("Gabim në marrjen e të dhënave:", error.message);
    res.status(500).send("Gabim gjatë marrjes së kriptovalutave");
  }
});

export default router;