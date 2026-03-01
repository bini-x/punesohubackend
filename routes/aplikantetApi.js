const express = require("express");
const Perdorues = require("../models/perdoruesSchema");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const aplikantet = await Perdorues.find({ tipiPerdoruesit: "aplikant" });

    return res.status(200).json({
      success: true,
      data: aplikantet,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Gabim i brendshem",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const aplikanti = await Perdorues.findById(id);

    return res.status(200).json({
      success: true,
      data: aplikanti,
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
