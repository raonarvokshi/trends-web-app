import express from "express";
import axios from "axios";
import { NewsAPIKey } from "../index.js";

const router = express.Router();

router.get("/news", async (req, res) => {
  const category = req.query.category || "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = 12;
  let data = [];
  let totalPages = 1;
  let totalResults;

  try {
    const url = category
      ? "https://newsapi.org/v2/top-headlines"
      : "https://newsapi.org/v2/everything";

    const response = await axios.get(url, {
      params: {
        apiKey: NewsAPIKey,
        category: category || undefined,
        q: category ? undefined : "news",
        page: page,
        pageSize: pageSize
      }
    });

    data = response.data.articles;
    totalResults = Math.min(response.data.totalResults, 100);
    totalPages = Math.ceil(totalResults / pageSize);

    // Nëse page është më i madh se totalPages -> ridrejto
    if (page > totalPages) {
      return res.redirect(`/news?category=${category}&page=${totalPages}`);
    }

  } catch (error) {
    // Nëse është error 426 => mos shfaq faqe të zbrazët, kthehu në faqen 1
    if (error.response && error.response.status === 426) {
      return res.redirect(`/news?category=${category}&page=1`);
    } else {
      console.error("Gabim duke marrë lajmet:", error.message);
    }
  }

  res.render("news/news.ejs", {
    data,
    activeCategory: category,
    currentPage: page,
    totalPages,
    totalNews: totalResults
  });
});


router.get("/news/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const category = req.query.category || "";
  const pageSize = 100;

  try {
    const url = category
      ? "https://newsapi.org/v2/top-headlines"
      : "https://newsapi.org/v2/everything";

    const response = await axios.get(url, {
      params: {
        apiKey: NewsAPIKey,
        category: category || undefined,
        q: category ? undefined : "news",
        page: 1,
        pageSize: pageSize
      }
    });

    const allArticles = response.data.articles || [];

    const filtered = allArticles.filter(article => {
      const title = article.title?.toLowerCase() || "";
      const description = article.description?.toLowerCase() || "";
      return title.includes(query) || description.includes(query);
    });

    res.json(filtered.slice(0, 12)); // maksimum 12 artikuj

  } catch (error) {
    console.error("Gabim në /news/search:", error.message);
    res.status(500).json([]);
  }
});

export default router;