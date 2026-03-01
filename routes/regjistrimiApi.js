const express = require("express");
const router = express.Router();
const Perdorues = require("../models/perdoruesSchema");
const PerdoruesPerkohshem = require("../models/perdoruesPerkohshemSchema");
const { dergoKodin } = require("../emailservice");

router.post("/perdoruesi", async (req, res) => {
  try {
    console.log(req.body);

    const { tipiPerdoruesit, email, fjalekalimi, emri, mbiemri, kompania } =
      req.body;

    const kodiVerifikimit = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await Perdorues.findOne({ email });

    if (user) {
      return res.status(400).json({
        error: "Perdoruesi ekziston",
      });
    }

    const perdoruesiPerkohshem = new PerdoruesPerkohshem({
      email,
      fjalekalimi,
      tipiPerdoruesit,
      kodiVerifikimit,
      skadimiKoditVerfikimit: Date.now() + 10 * 60 * 1000,
    });

    if (tipiPerdoruesit === "aplikant") {
      if (!emri) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emrin",
        });
      }
      if (!mbiemri) {
        return res.status(400).json({
          error: "Nuk e keni shenuar mbiemrin",
        });
      }
      if (!email) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emailin",
        });
      }
      if (!fjalekalimi) {
        return res.status(400).json({
          error: "Nuk e keni shenuar fjalekalimin",
        });
      }

      perdoruesiPerkohshem.emri = emri;
      perdoruesiPerkohshem.mbiemri = mbiemri;
    } else if (tipiPerdoruesit === "punedhenes") {
      if (!kompania) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emrin e kompanise",
        });
      }
      if (!email) {
        return res.status(400).json({
          error: "Nuk e keni shenuar emailin",
        });
      }
      if (!fjalekalimi) {
        return res.status(400).json({
          error: "Nuk e keni shenuar fjalekalimin",
        });
      }

      perdoruesiPerkohshem.kompania = kompania;
    } else {
      return res.status(400).json({
        success: false,
        error: "Tipi nuk eshte zgjedhur ose ka ndodhur ndonje gabim!",
      });
    }

    await perdoruesiPerkohshem.save();
    if (perdoruesiPerkohshem.emri) {
      await dergoKodin(email, emri, `Kodi juaj: ${kodiVerifikimit}`);
    }

    if (perdoruesiPerkohshem.kompania) {
      await dergoKodin(email, kompania, `Kodi juaj: ${kodiVerifikimit}`);
    }

    return res.status(200).json({
      success: true,
      message: "Kodi u dergua ne email",
      user: perdoruesiPerkohshem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
      error: error.message,
    });
  }
});

router.post("/verifiko", async (req, res) => {
  try {
    const { email, kodi } = req.body;

    const perdoruesiPerkohshem = await PerdoruesPerkohshem.findOne({ email });

    if (perdoruesiPerkohshem.kodiVerifikimit !== kodi) {
      return res.status(400).json({
        success: false,
        error: "Kodi eshte gabim",
      });
    }

    const perdorues = new Perdorues({
      email: perdoruesiPerkohshem.email,
      fjalekalimi: perdoruesiPerkohshem.fjalekalimi,
      tipiPerdoruesit: perdoruesiPerkohshem.tipiPerdoruesit,
    });

    if (perdorues.tipiPerdoruesit === "aplikant") {
      perdorues.emri = perdoruesiPerkohshem.emri;
      perdorues.mbiemri = perdoruesiPerkohshem.mbiemri;
    } else {
      perdorues.kompania = perdoruesiPerkohshem.kompania;
    }

    const perdoruesiRuajtur = await perdorues.save();

    await PerdoruesPerkohshem.findOneAndDelete({ email });

    return res.status(200).json({
      success: true,
      message: "Perdoruesi u regjistrua me sukses",
      user: perdoruesiRuajtur,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
      error: error.message,
    });
  }
});

module.exports = router;
