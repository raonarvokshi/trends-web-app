import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password)
});

router.get("/register", (req, res) => {
  res.render("auth/register.ejs");
});

export default router;