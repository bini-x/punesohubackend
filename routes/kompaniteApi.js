const express = require("express");
const router = express.Router();
const Perdoruesi = require("../models/perdoruesSchema");

router.get("/kompanite", async (req, res) => {
  try {
    const kompanite = await Perdoruesi.find({ tipiPerdoruesit: "punedhenes" });

    return res.status(200).json({
      success: true,
      data: kompanite,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Gabim i brendshem i serverit",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const kompania = await Perdoruesi.findById(id);

    return res.status(200).json({
      success: true,
      data: kompania,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Gabim i brendshem",
    });
  }
});

module.exports = router;
