// backend/routes/punetRuajturaApi.js
const express = require("express");
const router = express.Router();
const Perdorues = require("../models/perdoruesSchema");

// Ruaj një shpallje
router.post("/ruaj/:shpalljaId", async (req, res) => {
  try {
    const { shpalljaId } = req.params;
    const perdoruesiId = req.session.perdoruesiId; // Get user ID from request body

    if (!perdoruesiId) {
      return res.status(401).json({
        success: false,
        message: "Perdoruesi nuk është i kyçur",
      });
    }

    const perdoruesi = await Perdorues.findById(perdoruesiId);
    if (!perdoruesi) {
      return res.status(404).json({
        success: false,
        message: "Perdoruesi nuk u gjet",
      });
    }

    // Kontrollo nëse është ruajtur më parë
    if (perdoruesi.punetRuajtura.includes(shpalljaId)) {
      return res.status(400).json({
        success: false,
        message: "Shpallja është ruajtur më parë",
      });
    }

    perdoruesi.punetRuajtura.push(shpalljaId);
    await perdoruesi.save();

    return res.status(200).json({
      success: true,
      message: "Shpallja u ruajt me sukses",
      data: perdoruesi,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim gjatë ruajtjes",
      error: err.message,
    });
  }
});

// Hiq ruajtjen e një shpallje
router.delete("/hiq/:shpalljaId", async (req, res) => {
  try {
    const { shpalljaId } = req.params;
    const perdoruesiId = req.session.perdoruesiId; // Get user ID from request body

    if (!perdoruesiId) {
      return res.status(401).json({
        success: false,
        message: "Perdoruesi nuk është i kyçur",
      });
    }

    const perdoruesi = await Perdorues.findById(perdoruesiId);
    if (!perdoruesi) {
      return res.status(404).json({
        success: false,
        message: "Perdoruesi nuk u gjet",
      });
    }

    // Hiq shpalljen nga array
    perdoruesi.punetRuajtura = perdoruesi.punetRuajtura.filter(
      (id) => id.toString() !== shpalljaId,
    );
    await perdoruesi.save();

    return res.status(200).json({
      success: true,
      message: "Shpallja u hoq nga të ruajturat",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim gjatë heqjes",
      error: err.message,
    });
  }
});

// Merr të gjitha shpalljet e ruajtura për një përdorues
router.get("/shpalljet-e-ruajtura", async (req, res) => {
  try {
    const perdoruesiId = req.session.perdoruesiId;

    if (!perdoruesiId) {
      return res.status(401).json({
        success: false,
        message: "Perdoruesi nuk është i kyçur",
      });
    }

    const perdoruesi = await Perdorues.findById(perdoruesiId)
      .populate("punetRuajtura")
      .select("punetRuajtura");

    if (!perdoruesi) {
      return res.status(404).json({
        success: false,
        message: "Perdoruesi nuk u gjet",
      });
    }

    return res.status(200).json({
      success: true,
      data: perdoruesi.punetRuajtura,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim gjatë marrjes së shpalljeve",
      error: err.message,
    });
  }
});

// Kontrollo nëse një shpallje është e ruajtur
router.get("/eshte-ruajtur/:shpalljaId", async (req, res) => {
  try {
    const { shpalljaId } = req.params;
    const perdoruesiId = req.session.perdoruesiId;

    if (!perdoruesiId) {
      return res.status(200).json({
        success: true,
        eshteRuajtur: false,
      });
    }

    const perdoruesi = await Perdorues.findById(perdoruesiId);
    if (!perdoruesi) {
      return res.status(200).json({
        success: true,
        eshteRuajtur: false,
      });
    }

    const eshteRuajtur = perdoruesi.punetRuajtura.some(
      (id) => id.toString() === shpalljaId,
    );

    return res.status(200).json({
      success: true,
      eshteRuajtur: eshteRuajtur,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim gjatë kontrollit",
      error: err.message,
    });
  }
});

module.exports = router;
