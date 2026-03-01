const express = require("express");
const router = express.Router();
const Perdorues = require("../models/perdoruesSchema");

router.post("/perdoruesi", async (req, res) => {
  try {
    const { email, fjalekalimi } = req.body;
    console.log(req.body);

    let perdoruesiObj;

    const perdoruesi = await Perdorues.findOne({ email, fjalekalimi });
    if (!perdoruesi) {
      return res.status(400).json({
        status: "failed",
        error: "perdoruesi nuk ekziston",
      });
    }

    if (perdoruesi.tipiPerdoruesit === "aplikant") {
      perdoruesiObj = {
        _id: perdoruesi._id,
        emri: perdoruesi.emri,
        mbiemri: perdoruesi.mbiemri,
        email: perdoruesi.email,
        nrTelefonit: perdoruesi.nrTelefonit,
        tipiPerdoruesit: perdoruesi.tipiPerdoruesit,
        aftesite: perdoruesi.aftesite,
        foto: {
          emriFoto: perdoruesi.foto.emriFoto,
          mimetype: perdoruesi.foto.mimetype,
          size: perdoruesi.foto.size,
          uploadDate: perdoruesi.foto.uploadDate,
        },
      };
    } else if (perdoruesi.tipiPerdoruesit === "punedhenes") {
      perdoruesiObj = {
        _id: perdoruesi._id,
        kompania: perdoruesi.kompania,
        email: perdoruesi.email,
        nrTelefonit: perdoruesi.nrTelefonit,
        tipiPerdoruesit: perdoruesi.tipiPerdoruesit,
        foto: {
          emriFoto: perdoruesi.foto.emriFoto,
          mimetype: perdoruesi.foto.mimetype,
          size: perdoruesi.foto.size,
          uploadDate: perdoruesi.foto.uploadDate,
        },
      };
    }

    req.session.perdoruesiId = perdoruesiObj._id;

    res.json({
      success: true,
      perdoruesiObj,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Gabim i serverit",
    });
  }
});

router.get("/perdoruesi", async (req, res) => {
  try {
    const perdoruesiId = req.session.perdoruesiId;
    if (!perdoruesiId) {
      return res.status(200).json({
        success: false,
        message: "Nuk jeni kycur",
      });
    }

    const perdoruesi = await Perdorues.findById(perdoruesiId);

    if (!perdoruesi) {
      req.session.destroy();
      return res.status(200).json({
        success: false,
        message: "Sesioni ka skaduar",
      });
    }

    return res.status(200).json({
      success: true,
      perdoruesiObj: {
        _id: perdoruesi._id,
        emri: perdoruesi.emri,
        mbiemri: perdoruesi.mbiemri,
        email: perdoruesi.email,
        kompania: perdoruesi.kompania,
        tipiPerdoruesit: perdoruesi.tipiPerdoruesit,
        aftesite: perdoruesi.aftesite,
        nrTelefonit: perdoruesi.nrTelefonit,
        foto: {
          emriFoto: perdoruesi.foto.emriFoto,
          mimetype: perdoruesi.foto.mimetype,
          size: perdoruesi.foto.size,
          uploadDate: perdoruesi.foto.uploadDate,
        },
      },
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
