import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const router = express.Router();

router.get("/login", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return res.redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
  res.render("auth/login.ejs");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPwd = user.password;

      bcrypt.compare(password, storedPwd, async (err, match) => {
        if (err) {
          console.error(err);
          return res.render("auth/login.ejs", { error: "Error while logging in! something is wrong please try again later." })
        }

        if (match) {

          const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000
          });

          res.redirect("/");
        } else {
          res.render("auth/login.ejs", { error: "Password Incorrect" });
        }
      });
    } else {
      res.render("auth/login.ejs", { error: "Email Incorrect! Account not found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/register", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return res.redirect("/");
    } catch (err) {
      console.error(err);
    }
  }
  res.render("auth/register.ejs");
});


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkEmail.rows.length > 0) {
      res.render("auth/register.ejs", { error: "Email already exists" });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.error(`Error hashing password: ${err}`);
          return res.render("auth/register.ejs", { error: "Error while registering! something is wrong please try again later." });
        }

        await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
          [username, email, hash]
        );

        const token = jwt.sign(
          { id: user.id, email: user.email, username: user.username },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000
        });

        res.redirect("/");
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;