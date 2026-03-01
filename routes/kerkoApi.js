const express = require("express");
const router = express.Router();
const Shpallja = require("../models/shpalljaSchema");
const Perdoruesi = require("../models/perdoruesSchema");

router.get("/kerkoShpalljen", async (req, res) => {
  try {
    const { kerko, lokacioniPunes, kategoriaPunes } = req.query;
    const filter = {};

    if (kerko) {
      filter.$or = [
        { pozitaPunes: { $regex: kerko, $options: "i" } },
        { pershkrimiPunes: { $regex: kerko, $options: "i" } },
      ];
    }

    if (lokacioniPunes) {
      filter.lokacioniPunes = lokacioniPunes;
    }

    if (kategoriaPunes) {
      filter.kategoriaPunes = kategoriaPunes;
    }

    const shpalljetKerkuara = await Shpallja.find(filter);

    return res.status(200).json({
      success: true,
      data: shpalljetKerkuara,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Gabim i brendshem i serverit",
    });
  }
});

router.get("/kerkoKompanine", async (req, res) => {
  try {
    const { kerko, kompania } = req.query;
    const filter = {};

    if (kerko) {
      filter.$or = [{ kompania: { $regex: kerko, $options: "i" } }];
    }

    if (kompania) {
      filter.kompania = kompania;
    }
    const kompanite = await Perdoruesi.find(filter);

    return res.status(200).json({
      success: true,
      data: kompanite,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Gabim i brendshem i serverit",
    });
  }
});

router.get("/kerkoAplikantin", async (req, res) => {
  try {
    const { kerko, emri, mbiemri, aftesite } = req.query;
    const filter = {};

    if (kerko) {
      filter.$or = [
        { emri: { $regex: kerko, $options: "i" } },
        { mbiemri: { $regex: kerko, $options: "i" } },
        { aftesite: { $regex: kerko, $options: "i" } },
      ];
    }

    if (emri) filter.emri = emri;
    if (mbiemri) filter.mbiemri = mbiemri;
    if (aftesite) filter.aftesite = aftesite;

    const aplikantet = await Perdoruesi.find(filter);
    return res.status(200).json({
      success: true,
      data: aplikantet,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Gabim i brendshem i serverit",
    });
  }
});

module.exports = router;
