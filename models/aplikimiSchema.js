const mongoose = require("mongoose");

const aplikimiSchema = new mongoose.Schema({
  shpalljaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shpallja",
    required: true,
  },
  aplikantiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Perdorues",
    required: true,
  },
  emriFileCv: {
    type: String,
    required: false,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: false,
  },
  data: {
    type: Buffer,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: false,
  },
  emailAplikantit: {
    type: String,
    required: true,
  },
  emriAplikantit: {
    type: String,
    required: true,
  },
  mbiemriAplikantit: {
    type: String,
    required: true,
  },
  eksperienca: {
    type: String,
    required: false,
  },
  niveliPunes: {
    type: String,
    required: false,
  },
  nrTelefonit: {
    type: String,
    required: false,
  },
  letraMotivuese: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: "Ne_Pritje",
    enum: ["Ne_Pritje", "Pranuar", "Refuzuar"],
  },
  aftesite: {
    type: [String],
  },
  dataKrijimit: {
    type: Date,
    default: Date.now,
  },
});

aplikimiSchema.index({ shpalljaId: 1, aplikantiId: 1 }, { unique: true });

const Aplikimi = mongoose.model("Aplikimi", aplikimiSchema, "aplikimet");
module.exports = Aplikimi;
