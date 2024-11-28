const express = require("express");
const router = express.Router();
const db = require("../model/dbSchema");
const qrcode = require("qrcode");
const { nanoid } = require("nanoid");
const validateUrl = require("../Utils/validateUrl");

router.get("/nav/:urlid", async (req, res) => {
  try {
    const url = await db.findOne({ ID: req.params.urlid });
    if (url){
      await db.updateOne(
        {
          ID: req.params.urlid,
        },
        {
          $inc: { ClickCount: 1 },
        }
      );
      return res.redirect(302, url.OriginalUrl);
    } else {
      res.status(404).json("Not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

router.get("/Home", (req, res) => {
  res.status(200).render("Home", {});
});

router.get("/", (req, res) => {
  // res.status(200).render("Home",{})
  res.redirect("/Home");
});

router.get("/QRGen", (req, res) => {
  res.status(200).render("QRGen", {
    OriginalUrl: "",
    ShortUrl: "",
    qr_code: "",
  });
});

router.post("/QRCode", async (req, res) => {
  const { OriginalUrl } = req.body;
  // const base = req.headers.origin //process.env.BASE;
  const base = process.env.BASE;

  const ID = nanoid();

  if (validateUrl(OriginalUrl)) {
    try {
      // Check if URL already exists
      let url = await db.findOne({ OriginalUrl });
      if (url) {
        res.send(url); // Return existing URL
      } else {
        // Generate short URL
        const shortUrl = `${base}/nav/${ID}`;

        // Generate QR code
        const QrCode = await qrcode.toDataURL(shortUrl);

        // Save new entry in database
        let newQr = new db({
          OriginalUrl,
          ShortUrl: shortUrl,
          QrCode,
          ID,
          date: new Date(),
        });

        await newQr.save();

        // Send the newly created URL object
        res.send(newQr);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});


router.post("/Update", async (req, res) => {
  const { ShortlUrl, OriginalUrl } = req.body;
  try {
    const url = await db.findOne({ ShortUrl: ShortlUrl });
    if (url) {
      await db.updateOne({
        OriginalUrl: OriginalUrl,
      });
      return res.render("QRgen", {
        OriginalUrl: OriginalUrl,
        ShortUrl: ShortlUrl,
        qr_code: "",
      });
    } else {
      res.status(404).json("Not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});
module.exports = router;
