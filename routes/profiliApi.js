const express = require("express");
const router = express.Router();
const uploadFoto = require("../upload-foto"); // Import foto upload config
const Perdorues = require("../models/perdoruesSchema");
const Shpallja = require("../models/shpalljaSchema");

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const perdoruesi = await Perdorues.findById(id);

    if (!perdoruesi) {
      return res.status(404).json({
        success: false,
        message: "Perdoruesi nuk u gjet",
      });
    }

    return res.status(200).json({
      success: true,
      data: perdoruesi,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem",
    });
  }
});
router.get("/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const perdoruesi = await Perdorues.findOne({ email: email });

    if (!perdoruesi) {
      return res.status(404).json({
        success: false,
        message: "Perdoruesi nuk u gjet",
      });
    }

    return res.status(200).json({
      success: true,
      data: perdoruesi,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem",
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const perdoruesiVjeter = await Perdorues.findById(id);
    const perdoruesi = await Perdorues.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (
      perdoruesiVjeter.tipiPerdoruesit === "punedhenes" &&
      updateData.email &&
      updateData.email !== perdoruesiVjeter.email
    ) {
      await Shpallja.updateMany(
        { emailKompanise: perdoruesiVjeter.email },
        { $set: { emailKompanise: updateData.email } },
      );
    }

    res.status(200).json({
      success: true,
      message: "U modifikua me sukses",
      data: perdoruesi,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({
        success: false,
        error: "Perdoruesi me kete email ekziston",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
    });
  }
});

router.post(
  "/:id/ngarko-foto",
  uploadFoto.single("photoFile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Ju lutem zgjidhni një foto",
        });
      }

      const perdoruesiId = req.params.id;

      const perdoruesi = await Perdorues.findByIdAndUpdate(
        perdoruesiId,
        {
          foto: {
            emriFoto: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer,
            uploadDate: new Date(),
          },
        },
        { new: true },
      );

      if (!perdoruesi) {
        return res.status(404).json({
          success: false,
          message: "Perdoruesi nuk u gjet",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fotoja u ngarkua me sukses",
        data: {
          emriFoto: perdoruesi.foto.emriFoto,
          uploadDate: perdoruesi.foto.uploadDate,
        },
      });
    } catch (error) {
      console.error(error);

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Madhësia e fotos është shumë e madhe. Maksimumi 5MB",
        });
      }

      if (
        error.message &&
        error.message.includes("Vetem foto jane te lejuara")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Gabim i brendshem i serverit",
      });
    }
  },
);

router.get("/:id/foto", async (req, res) => {
  try {
    const perdoruesi = await Perdorues.findById(req.params.id);

    if (!perdoruesi || !perdoruesi.foto || !perdoruesi.foto.data) {
      return res.status(404).json({
        success: false,
        message: "Fotoja nuk u gjet",
      });
    }

    res.set({
      "Content-Type": perdoruesi.foto.mimetype,
      "Content-Length": perdoruesi.foto.size,
      "Cache-Control": "public, max-age=86400",
    });

    res.send(perdoruesi.foto.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem",
    });
  }
});

router.delete("/:id/foto", async (req, res) => {
  try {
    const perdoruesi = await Perdorues.findByIdAndUpdate(
      req.params.id,
      { $unset: { foto: "" } },
      { new: true },
    );

    if (!perdoruesi) {
      return res.status(404).json({
        success: false,
        message: "Perdoruesi nuk u gjet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fotoja u fshi me sukses",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem",
    });
  }
});

module.exports = router;
