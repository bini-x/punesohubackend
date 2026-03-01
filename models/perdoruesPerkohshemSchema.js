const mongoose = require("mongoose");

const perdoruesPerkohshemSchema = new mongoose.Schema({
  tipiPerdoruesit: {
    type: String,
    enum: ["aplikant", "punedhenes"],
  },
  emri: {
    type: String,
    required: function () {
      return this.tipiPerdoruesit === "aplikant";
    },
  },
  mbiemri: {
    type: String,
    required: function () {
      return this.tipiPerdoruesit === "aplikant";
    },
  },
  kompania: {
    type: String,
    required: function () {
      return this.tipiPerdoruesit === "punedhenes";
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fjalekalimi: {
    type: String,
    required: true,
  },
  kodiVerifikimit: {
    type: String,
  },
  skadimiKoditVerfikimit: {
    type: Date,
  },
  dataRegjistrimit: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const PerdoruesPerkohshem = mongoose.model(
  "PerdoruesPerkohshem",
  perdoruesPerkohshemSchema,
  "perdoruesitPerkohshem",
);
module.exports = PerdoruesPerkohshem;
