import express from "express";
import axios from "axios";
import { moviesAPIKey } from "../index.js";
import { authenticateToken } from "../middleware/middleware.js";


const router = express.Router();


router.get("/popular/movies", async (req, res) => {
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


router.get("/popular/movies/search", async (req, res) => {
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

router.get("/top-rated/movies", async (req, res) => {
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


router.get("/top-rated/movies/search", async (req, res) => {
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




router.get("/upcoming/movies", async (req, res) => {
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


router.get("/upcoming/movies/search", async (req, res) => {
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



router.get("/movie/:id", async (req, res) => {
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

export default router;