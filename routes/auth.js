import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});

router.get("/register", (req, res) => {
  res.render("auth/register.ejs");
});

export default router;