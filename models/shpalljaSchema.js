const mongoose = require("mongoose");

const shpalljaSchema = new mongoose.Schema({
  emailKompanise: {
    type: String,
    required: true,
  },
  perdoruesiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Perdorues",
    required: true,
  },
  pozitaPunes: {
    type: String,
    required: true,
  },
  emriKompanise: {
    type: String,
    required: true,
  },
  kategoriaPunes: {
    type: String,
    enum: [
      "Industria",
      "Administrate",
      "Agrikulture-Industri-Ushqimore",
      "Arkitekture",
      "Banka",
      "Retail-Distribuim",
      "Ndertimtari-Patundshmeri",
      "Mbeshtetje-Konsumatoreve-Call-Center",
      "Ekonomi-Finance-Kontabilitet",
      "Edukim-Shkence-Hulumtim",
      "Pune-Te-Pergjithshme",
      "Burime-Njerezore",
      "Teknologji-Informacioni",
      "Sigurim",
      "Gazetari-Shtyp-Media",
      "Ligj-Legjislacion",
      "Menaxhment",
      "Marketing-Reklamim-Pr",
      "Inxhinieri",
      "Shendetesi-Medicine",
      "Prodhim",
      "Siguri$Mbrojtje",
      "Industri te sherbimit",
      "Telekomunikim",
      "Tekstil, Lekure, Industri Veshembathje",
      "Gastronomi, Hoteleri, Turizem",
      "Transport, Logjistike",
      "IT",
    ],
    required: true,
  },
  lokacioniPunes: {
    type: String,
    required: true,
  },
  pershkrimiPunes: {
    type: String,
    required: true,
  },
  niveliPunes: {
    type: String,
    enum: [
      "",
      "Praktike",
      "Fillestar",
      "Junior",
      "Mid-level",
      "Senior",
      "Lider",
      "Menaxher",
      "Drejtor",
    ],
    required: false,
    default: "",
  },
  orari: {
    type: [String],
    enum: ["", "Full-time", "Part-time"],
    required: true,
    default: [],
  },
  eksperienca: {
    type: String,
    required: false,
  },
  aftesitePrimare: {
    type: [String],
  },
  aftesiteSekondare: {
    type: [String],
  },
  pagaPrej: {
    type: Number,
    required: false,
  },
  pagaDeri: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ["aktiv", "skaduar"],
    default: "aktiv",
  },
  dataKrijimit: {
    type: Date,
    default: Date.now,
  },
  fotoProfili: {
    type: String,
    required: false,
  },
});

shpalljaSchema.virtual("kompania", {
  ref: "Perdorues",
  localField: "perdoruesiId",
  foreignField: "_id",
  justOne: true,
});

shpalljaSchema.virtual("aplikimet", {
  ref: "Aplikimi",
  localField: "_id",
  foreignField: "shpalljaId",
});

shpalljaSchema.virtual("numriAplikimeve", {
  ref: "Aplikimi",
  localField: "_id",
  foreignField: "shpalljaId",
  count: true,
});

shpalljaSchema.set("toJSON", { virtuals: true });
shpalljaSchema.set("toObject", { virtuals: true });

const Shpallja = mongoose.model("Shpallja", shpalljaSchema, "shpalljet");
module.exports = Shpallja;
