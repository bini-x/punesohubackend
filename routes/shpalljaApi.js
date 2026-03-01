const express = require("express");
const router = express.Router();
const Shpallja = require("../models/shpalljaSchema");
const Aplikimi = require("../models/aplikimiSchema");
const { dergoNdryshimPune, dergoMesazhin } = require("../emailservice");
const axios = require("axios");

async function fetchCompanyPhoto(emailKompanise, perdoruesiId) {
  try {
    if (perdoruesiId) {
      const photoUrl = `http://localhost:3000/api/profili/${perdoruesiId}/foto`;

      try {
        await axios.head(photoUrl);
        return photoUrl;
      } catch (err) {
        console.log(`No photo found for user ${perdoruesiId}`);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching company photo:", error.message);
    return null;
  }
}

router.get("/kompania", async (req, res) => {
  try {
    const now = new Date();
    // const tridhjeteDite = 2 * 60 * 1000;
    const tridhjeteDite = 30 * 24 * 60 * 60 * 1000;
    const expiredJobs = await Shpallja.find({
      status: "aktiv",
      dataKrijimit: { $lt: new Date(now - tridhjeteDite) },
    });

    for (const shpallja of expiredJobs) {
      shpallja.status = "skaduar";
      await shpallja.save();
    }

    const shpalljet = await Shpallja.aggregate([
      {
        $lookup: {
          from: "aplikimet",
          localField: "_id",
          foreignField: "shpalljaId",
          as: "apps",
        },
      },
      {
        $addFields: {
          numriNePritje: {
            $size: {
              $filter: {
                input: "$apps",
                as: "app",
                cond: { $eq: ["$$app.status", "Ne_Pritje"] },
              },
            },
          },
          numriPranuar: {
            $size: {
              $filter: {
                input: "$apps",
                as: "app",
                cond: { $eq: ["$$app.status", "Pranuar"] },
              },
            },
          },
          numriRefuzuar: {
            $size: {
              $filter: {
                input: "$apps",
                as: "app",
                cond: { $eq: ["$$app.status", "Refuzuar"] },
              },
            },
          },
        },
      },
      {
        $project: { apps: 0 }, // remove the raw applications array
      },
      { $sort: { dataKrijimit: -1 } },
    ]);

    // Add company profile photos to each job posting
    const shpalljetWithPhotos = await Promise.all(
      shpalljet.map(async (shpallja) => {
        // If job posting doesn't have a photo URL, fetch from company profile
        if (!shpallja.fotoProfili) {
          const photoUrl = await fetchCompanyPhoto(
            shpallja.emailKompanise,
            shpallja.perdoruesiId,
          );

          if (photoUrl) {
            shpallja.fotoProfili = photoUrl;
          }
        }

        return shpallja;
      }),
    );

    return res.status(200).json({
      success: true,
      data: shpalljetWithPhotos,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem",
    });
  }
});

router.get("/kompania/im", async (req, res) => {
  try {
    const perdoruesiId = req.session.perdoruesiId;

    const shpalljet = await Shpallja.find({ perdoruesiId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: shpalljet });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const shpallja = await Shpallja.findById(req.params.id)
      .populate({
        path: "aplikimet",
        options: { sort: { dataAplikimit: -1 } },
      })
      .populate("numriAplikimeve")
      .populate("perdoruesiId");

    if (!shpallja) {
      return res.status(404).json({
        success: false,
        message: "Shpallja nuk u gjet",
      });
    }

    const shpalljaObj = shpallja.toObject();

    if (!shpalljaObj.fotoProfili) {
      const photoUrl = await fetchCompanyPhoto(
        shpallja.emailKompanise,
        shpallja.perdoruesiId,
      );

      if (photoUrl) {
        shpalljaObj.fotoProfili = photoUrl;
      }
    }

    return res.status(200).json({
      success: true,
      data: shpalljaObj,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim i serverit",
    });
  }
});

router.get("/:id/aplikimi", async (req, res) => {
  try {
    const shpallja = await Shpallja.findById(req.params.id);

    if (!shpallja) {
      return res.status(404).json({
        success: false,
        message: "Shpallja u gjet",
      });
    }

    return res.status(200).json({
      success: true,
      data: shpallja,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Gabim i serverit",
    });
  }
});

router.post("/kompania", async (req, res) => {
  try {
    const {
      emailKompanise,
      emriKompanise,
      pozitaPunes,
      kategoriaPunes,
      lokacioniPunes,
      pershkrimiPunes,
      niveliPunes,
      orari,
      aftesitePrimare,
      aftesiteSekondare,
      eksperienca,
      pagaPrej,
      pagaDeri,
      perdoruesiId,
    } = req.body;

    if (pagaDeri < pagaPrej) {
      return res.status(400).json({
        success: false,
        error: "Rangu i pages gabim!",
      });
    }

    // Automatically fetch company profile photo URL
    const fotoProfili = await fetchCompanyPhoto(emailKompanise, perdoruesiId);

    if (fotoProfili) {
      console.log("Company photo URL attached:", fotoProfili);
    } else {
      console.log("No company photo found");
    }

    console.log(
      emailKompanise,
      emriKompanise,
      pozitaPunes,
      kategoriaPunes,
      lokacioniPunes,
      pershkrimiPunes,
      niveliPunes,
      orari,
      eksperienca,
      aftesitePrimare,
      aftesiteSekondare,
      pagaPrej,
      pagaDeri,
      perdoruesiId,
      fotoProfili ? "Photo URL attached" : "No photo",
    );

    const shpallja = new Shpallja({
      emailKompanise,
      emriKompanise,
      pozitaPunes,
      kategoriaPunes,
      lokacioniPunes,
      pershkrimiPunes,
      niveliPunes,
      orari,
      eksperienca,
      aftesitePrimare,
      aftesiteSekondare,
      pagaPrej,
      pagaDeri,
      perdoruesiId,
      fotoProfili, // Store the photo URL
    });

    const shpalljaPunes = await shpallja.save();

    return res.status(200).json({
      success: true,
      message: "puna u shpall me sukses",
      data: shpalljaPunes,
    });
  } catch (err) {
    console.error("Error creating shpallja:", err);
    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const shpalljaId = req.params.id;
    const shpallja = await Shpallja.findById(shpalljaId);

    const aplikantet = await Aplikimi.find({ shpalljaId: shpalljaId });

    for (const aplikimi of aplikantet) {
      const email = aplikimi.emailAplikantit;
      if (email && email.trim() !== "") {
        const emri = aplikimi.emriAplikantit || "";
        await dergoMesazhin(
          email.trim().replace(/['"]+/g, ""),
          emri,
          "Shpallja eshte fshire",
          `Shpallja "${shpallja.pozitaPunes}" e kompanise "${shpallja.emriKompanise}" eshte fshire nga punedhenesi.`,
        );
      }
    }

    await Aplikimi.deleteMany({ shpalljaId: shpalljaId });
    await Shpallja.findByIdAndDelete(shpalljaId);

    res.status(200).json({
      success: true,
      message: "U fshi me sukses",
      data: shpallja,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const shpalljaId = req.params.id;

    // Fetch the old shpallja
    const oldShpallja = await Shpallja.findById(shpalljaId);
    if (!oldShpallja) {
      return res.status(404).json({
        success: false,
        message: "Shpallja nuk u gjet",
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // If no fotoProfili, fetch from company email
    if (!updateData.fotoProfili) {
      const photoUrl = await fetchCompanyPhoto(
        oldShpallja.emailKompanise,
        oldShpallja.perdoruesiId,
      );
      if (photoUrl) updateData.fotoProfili = photoUrl;
    }

    // Update shpallja
    const shpallja = await Shpallja.findByIdAndUpdate(shpalljaId, updateData, {
      new: true,
      runValidators: true,
    });

    // Compare old and new primary skills
    const oldSkills = (oldShpallja.aftesitePrimare || []).map((skill) =>
      skill.toLowerCase(),
    );
    const newSkills = (shpallja.aftesitePrimare || []).map((skill) =>
      skill.toLowerCase(),
    );
    const skillsChanged =
      oldSkills.length !== newSkills.length ||
      oldSkills.some((skill, i) => skill !== newSkills[i]);

    let deletedCount = 0;
    let keptCount = 0;

    if (skillsChanged) {
      console.log(
        "Aftësitë primare kanë ndryshuar. Duke kontrolluar aplikantët...",
      );

      const applicants = await Aplikimi.find({ shpalljaId });

      for (const app of applicants) {
        const applicantSkills = (app.aftesite || []).map((skill) =>
          skill.toLowerCase(),
        );
        const hasAllSkills = newSkills.every((skill) =>
          applicantSkills.includes(skill),
        );
        const email = app.emailAplikantit?.trim();

        if (!hasAllSkills) {
          // Calculate missing skills
          const missingSkills = newSkills.filter(
            (skill) => !applicantSkills.includes(skill.toLowerCase()),
          );

          // Delete unqualified applicant
          await Aplikimi.findByIdAndDelete(app._id);
          deletedCount++;

          // Send deletion email with only missing skills
          if (email) {
            try {
              await dergoNdryshimPune(
                email,
                app.emriAplikantit || "Aplikant",
                shpallja.pozitaPunes,
                shpallja.emriKompanise,
                `Aftësitë primare të këtij vendi pune kanë ndryshuar. ` +
                  `Aplikimi juaj është fshirë sepse nuk i posedoni këto aftësi: ${missingSkills.join(", ")}.`,
              );
            } catch (emailErr) {
              console.error(
                `Email dështoi për ${app.emailAplikantit}:`,
                emailErr,
              );
            }
          }
        } else {
          // Applicant kept → send “still active” email
          keptCount++;
          if (email) {
            try {
              await dergoNdryshimPune(
                email,
                app.emriAplikantit || "Aplikant",
                shpallja.pozitaPunes,
                shpallja.emriKompanise,
                `Aftësitë primare të këtij vendi pune kanë ndryshuar. ` +
                  `Aplikimi juaj mbetet aktiv sepse i posedoni këto aftësi: ${newSkills.join(", ")}.`,
              );
            } catch (emailErr) {
              console.error(
                `Email dështoi për ${app.emailAplikantit}:`,
                emailErr,
              );
            }
          }
        }
      }
    } else {
      const allApplicants = await Aplikimi.find({ shpalljaId });

      for (const app of allApplicants) {
        const email = app.emailAplikantit?.trim();
        if (email) {
          try {
            await dergoNdryshimPune(
              email,
              app.emriAplikantit || "",
              shpallja.pozitaPunes,
              shpallja.emriKompanise,
              `Ju lutemi kontrolloni aplikimin për detaje të reja.`,
            );
          } catch (emailErr) {
            console.error(`Email dështoi për ${email}:`, emailErr);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "U modifikua me sukses",
      data: shpallja,
      aplikantetNjoftuar: deletedCount + keptCount,
      deletedCount,
      keptCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
    });
  }
});

module.exports = router;
