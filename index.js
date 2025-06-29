import express from "express";
import axios from "axios";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

const localhost = `http://localhost:${port}`;
const NewsAPIKey = process.env.NEWS_API_KEY;
const moviesAPIKey = process.env.MOVIES_API_KEY;
const stockMarketAPIKey = process.env.STOCK_MARKET_API_KEY;


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
  res.render("index.ejs");
})


app.get("/news", async (req, res) => {
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


app.get("/news/search", async (req, res) => {
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



app.get("/popular/movies", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const selectedGenre = req.query.genre;
  const limit = 12;
  let data = [];
  let paginatedMovies = [];
  let totalPages = 1;

  try {
    for (let i = 1; i <= 8; i++) {
      const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: moviesAPIKey,
          page: i
        }
      });

      const results = selectedGenre
        ? response.data.results.filter(movie =>
          movie.genre_ids.includes(parseInt(selectedGenre))
        )
        : response.data.results;

      data.push(...results);
    }

    totalPages = Math.ceil(data.length / limit);
    paginatedMovies = data.slice((page - 1) * limit, page * limit);
  } catch (error) {
    console.error("Gabim:", error.message);
  }

  res.render("movies/popular.ejs", {
    movies: paginatedMovies,
    currentPage: page,
    totalPages,
    totalMovies: data.length,
    genre: selectedGenre,
  });
});


app.get("/popular/movies/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const selectedGenre = req.query.genre;
  let data = [];

  try {
    for (let i = 1; i <= 8; i++) {
      const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
        params: {
          api_key: moviesAPIKey,
          page: i
        }
      });

      const results = selectedGenre
        ? response.data.results.filter(movie =>
          movie.genre_ids.includes(parseInt(selectedGenre))
        )
        : response.data.results;

      data.push(...results);
    }

    const filtered = data.filter(movie => {
      const title = movie.title?.toLowerCase() || "";
      return title.includes(query);
    });

    res.json(filtered.slice(0, 12));
  } catch (error) {
    console.error("Gabim në search:", error.message);
    res.status(500).json([]);
  }
});




app.get("/top-rated/movies", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const selectedGenre = req.query.genre;
  const limit = 12;
  let data = [];

  try {
    for (let i = 1; i <= 8; i++) {
      const response = await axios.get("https://api.themoviedb.org/3/movie/top_rated", {
        params: {
          api_key: moviesAPIKey,
          page: i
        }
      });

      const results = selectedGenre
        ? response.data.results.filter(movie => movie.genre_ids.includes(parseInt(selectedGenre)))
        : response.data.results;

      data.push(...results);
    }

  } catch (error) {
    console.log(error.message);
  }

  const totalPages = Math.ceil(data.length / limit);
  const paginatedMovies = data.slice((page - 1) * limit, page * limit);

  res.render("movies/topRated.ejs", {
    movies: paginatedMovies,
    currentPage: page,
    totalPages,
    totalMovies: data.length,
    genre: selectedGenre
  });
});


app.get("/top-rated/movies/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const selectedGenre = req.query.genre;
  let data = [];

  try {
    for (let i = 1; i <= 8; i++) {
      const response = await axios.get("https://api.themoviedb.org/3/movie/top_rated", {
        params: {
          api_key: moviesAPIKey,
          page: i
        }
      });

      const results = selectedGenre
        ? response.data.results.filter(movie =>
          movie.genre_ids.includes(parseInt(selectedGenre))
        )
        : response.data.results;

      data.push(...results);
    }

    const filtered = data.filter(movie => {
      const title = movie.title?.toLowerCase() || "";
      return title.includes(query);
    });

    res.json(filtered.slice(0, 12));
  } catch (error) {
    console.error("Gabim në search:", error.message);
    res.status(500).json([]);
  }
});




app.get("/upcoming/movies", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const selectedGenre = req.query.genre;
  const limit = 12;
  let data = [];

  try {
    for (let i = 1; i <= 8; i++) {
      const response = await axios.get("https://api.themoviedb.org/3/movie/upcoming", {
        params: {
          api_key: moviesAPIKey,
          page: i
        }
      });
      const results = selectedGenre
        ? response.data.results.filter(movie => movie.genre_ids.includes(parseInt(selectedGenre)))
        : response.data.results;

      data.push(...results);
    }
  } catch (error) {
    console.error(error.message);
  }

  const totalPages = Math.ceil(data.length / limit);
  const paginatedMovies = data.slice((page - 1) * limit, page * limit);

  res.render("movies/upcoming.ejs", {
    movies: paginatedMovies,
    currentPage: page,
    totalPages,
    totalMovies: data.length,
    genre: selectedGenre
  });
});


app.get("/upcoming/movies/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const selectedGenre = req.query.genre;
  let data = [];

  try {
    for (let i = 1; i <= 8; i++) {
      const response = await axios.get("https://api.themoviedb.org/3/movie/upcoming", {
        params: {
          api_key: moviesAPIKey,
          page: i
        }
      });

      const results = selectedGenre
        ? response.data.results.filter(movie =>
          movie.genre_ids.includes(parseInt(selectedGenre))
        )
        : response.data.results;

      data.push(...results);
    }

    const filtered = data.filter(movie => {
      const title = movie.title?.toLowerCase() || "";
      return title.includes(query);
    });

    res.json(filtered.slice(0, 12));
  } catch (error) {
    console.error("Gabim në /upcoming/movies/search:", error.message);
    res.status(500).json([]);
  }
});



app.get("/movie/:id", async (req, res) => {
  const movieId = req.params.id;
  let recResults;

  try {
    // Kërko direkt një film specifik me ID
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: moviesAPIKey
      }
    });

    const movie = response.data;

    if (movie) {
      const movieId = movie["id"];
      const recResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, {
        params: {
          api_key: moviesAPIKey
        }
      });
      recResults = recResponse.data.results.slice(0, 4);
    }

    res.render("movies/movieDetail.ejs", {
      movie,
      recMovies: recResults
    });

  } catch (error) {
    console.error(error.message);
    res.status(404).send("Movie not found");
  }
});


app.get("/crypto", async (req, res) => {
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


app.get("/stocks", async (req, res) => {
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


app.get("/dashboard", async (req, res) => {
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


app.listen(port, () => {
  console.log(`Server running on ${localhost}`)
});