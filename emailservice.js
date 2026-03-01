const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const layout = (content) => `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:500px;margin:auto;background:#ffffff;border-radius:10px;padding:32px;text-align:center;">
      ${content}
      <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Punesohu</p>
    </div>
  </div>
`;

const dergoKodin = async (email, emri, kodi) => {
  const html = layout(`
    <h2 style="color:#111827;margin-bottom:10px;">Verifikoni emailin</h2>
    <p style="color:#4b5563;font-size:15px;margin-bottom:30px;">
      Pershendetje ${emri || ""}, perdorni kodin e meposhtem per verifikim te emailit.
    </p>
    <div style="
      display:inline-block;
      background:#111827;
      color:#ffffff;
      font-size:32px;
      letter-spacing:6px;
      padding:16px 28px;
      border-radius:8px;
      font-weight:bold;
      margin-bottom:30px;
    ">
      ${kodi}
    </div>
    <p style="font-size:13px;color:#6b7280;">Kodi skadon pas 10 minutash</p>
  `);

  await transporter.sendMail({
    from: `"Punesohu" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verifikoni emailin",
    html,
  });
};

const dergoStatusin = async (
  email,
  emri,
  puna,
  kompania,
  statusi,
  mesazhShtese = "",
) => {
  const isAccepted = statusi === "Pranuar";
  const statusText = isAccepted ? "Pranuar" : "Refuzuar";
  const statusColor = isAccepted ? "#10b981" : "#ef4444";

  const html = layout(`
    <h2 style="color:#111827;margin-bottom:10px;">Aplikimi u ${statusText === "Pranuar" ? "Pranua" : "Refuzua"}</h2>
    <p style="color:#4b5563;font-size:15px;margin-bottom:20px;">
      Pershendetje ${emri || ""},
    </p>
    <p style="color:#4b5563;font-size:15px;margin-bottom:20px;">
      Aplikimi juaj per poziten: <strong>${puna}</strong> te kompania:  
      <strong>${kompania}</strong> eshte 
      <span style="color:${statusColor};font-weight:bold;">${statusText}</span>.
    </p>
    ${mesazhShtese ? `<p style="color:#4b5563;font-size:15px;margin-bottom:30px;">${mesazhShtese}</p>` : ""}
  `);

  await transporter.sendMail({
    from: `"Punesohu" <${process.env.EMAIL}>`,
    to: email,
    subject: "Statusi i Aplikimit",
    html,
  });
};

const dergoKonfirmimAplikimi = async (email, emri, puna, kompania) => {
  const html = layout(`
    <h2 style="color:#111827;margin-bottom:10px;">Aplikimi u dergua me sukses!</h2>
    <p style="color:#4b5563;font-size:15px;margin-bottom:20px;">
      Pershendetje ${emri || ""},
    </p>
    <p style="color:#4b5563;font-size:15px;margin-bottom:20px;">
      Faleminderit per aplikimin tuaj ne poziten: <strong>${puna}</strong> te kompania:  
      <strong>${kompania}</strong>.
    </p>
    <p style="color:#4b5563;font-size:15px;margin-bottom:30px;">
      Kemi pranuar aplikimin tuaj, do e shqyrtojme se shpejti!
    </p>
  `);

  await transporter.sendMail({
    from: `"Punesohu" <${process.env.EMAIL}>`,
    to: email,
    subject: "Aplikimi u dergua me sukses!",
    html,
  });
};

const dergoNdryshimPune = async (email, emri, puna, kompania, mesazhi) => {
  const html = layout(`
    <h2 style="color:#111827;margin-bottom:10px;">Shpallja e punes eshte perditesuar</h2>
    <p style="color:#4b5563;font-size:15px;margin-bottom:20px;">
      Pershendetje ${emri || ""},
    </p>
    <p style="color:#4b5563;font-size:15px;margin-bottom:20px;">
      Shpallja e punes: <strong>${puna}</strong> te kompania: <strong>${kompania}</strong> ka ndryshuar.
    </p>
    <p style="color:#4b5563;font-size:15px;margin-bottom:30px;">
${mesazhi}
    </p>
  `);

  await transporter.sendMail({
    from: `"Punesohu" <${process.env.EMAIL}>`,
    to: email,
    subject: "Shpallja e punes eshte perditesuar",
    html,
  });
};

const dergoMesazhin = async (email, emri, subject, mesazhi) => {
  const html = layout(`
    <h2 style="color:#111827;margin-bottom:10px;">${subject}</h2>
    <p style="color:#4b5563;font-size:15px;margin-bottom:20px;">
      Pershendetje ${emri || ""},
    </p>
    <p style="color:#4b5563;font-size:15px;margin-bottom:30px;">
      ${mesazhi}
    </p>
  `);

  await transporter.sendMail({
    from: `"Punesohu" <${process.env.EMAIL}>`,
    to: email,
    subject: subject,
    html,
  });
};

module.exports = {
  dergoKodin,
  dergoStatusin,
  dergoKonfirmimAplikimi,
  dergoNdryshimPune,
  dergoMesazhin,
};
