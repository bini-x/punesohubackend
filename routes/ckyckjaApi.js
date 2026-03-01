const express = require("express");
const router = express.Router();

router.post("/perdoruesi", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Gabim gjate ckycjes",
        });
      }

      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: false,
        domain: "localhost",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.json({
        success: true,
        message: "Jeni ckycur me sukses!",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gabim i brendshem i serverit",
    });
  }
});

module.exports = router;
