const mongoose = require("mongoose");

const perdoruesSchema = new mongoose.Schema(
  {
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
    profesioni: {
      type: String,
      required: false,
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
    nrTelefonit: {
      type: String,
      required: false,
    },
    punetRuajtura: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shpallja",
      },
    ],
    aftesite: {
      type: [String],
    },
    foto: {
      emriFoto: {
        type: String,
        required: false,
      },
      mimetype: {
        type: String,
        required: false,
      },
      size: {
        type: Number,
        required: false,
      },
      data: {
        type: Buffer,
        required: false,
      },
      uploadDate: {
        type: Date,
        required: false,
      },
    },
    eksperiencat: [
      {
        titulli: String,
        kompania: String,
        dataFillimit: Date,
        dataMbarimit: Date,
        aktuale: Boolean,
        pershkrimi: String,
      },
    ],
    linqet: [
      {
        platforma: String,
        linku: String,
      },
    ],
    edukimi: [
      {
        titulli: String,
        institucioni: String,
        dataFillimit: Date,
        dataMbarimit: Date,
        aktuale: Boolean,
        pershkrimi: String,
      },
    ],
    projektet: [
      {
        emriProjektit: String,
        pershkrimi: String,
        teknologjite: String,
        linku: String,
      },
    ],
    rrethKompanise: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Perdorues = mongoose.model("Perdorues", perdoruesSchema, "perdoruesit");
module.exports = Perdorues;
