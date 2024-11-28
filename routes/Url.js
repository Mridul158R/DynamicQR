const express = require("express");
const { nanoid } = require("nanoid");
const db = require("../model/dbSchema");
const dotenv = require("dotenv");
const validateUrl = require("../Utils/validateUrl");

dotenv.config({ path: "../config/.env" });
const router = express.Router();

router.post("/urlShortener", async (req, res) => {
  const { OriginalUrl } = req.body;
  // const base = req.headers.origin //process.env.BASE;
  const base = process.env.BASE;

  const ID = nanoid();

  if (validateUrl(OriginalUrl)) {
    try {
      let url = await db.findOne({ OriginalUrl });
      if (url) {
        // res.json(url);
        res.send({
          OriginalUrl: url.OriginalUrl,
          ShortUrl: url.ShortUrl,
          qr_code: "",
        });
      } else {
        const shortUrl = `${base}/nav/${ID}`;
        url = new db({
          OriginalUrl,
          ShortUrl: shortUrl,
          ID,
          date: new Date(),
        });
        await url.save();
        // res.json(url);
        res.send({
          OriginalUrl: url.OriginalUrl,
          ShortUrl: url.ShortUrl,
          qr_code: "",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

module.exports = router;
