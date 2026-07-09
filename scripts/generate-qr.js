/**
 * Generates a QR code PNG that links directly to the registration section of
 * your deployed site.
 *
 * Usage (after deploying to Vercel):
 *   node scripts/generate-qr.js https://your-deployed-site.vercel.app
 *
 * Or, without an argument, it falls back to NEXT_PUBLIC_SITE_URL from your
 * environment (see .env.example).
 *
 * Output: public/images/registration-qr.png
 */
const QRCode = require("qrcode");
const path = require("path");

const targetUrl = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL;

if (!targetUrl) {
  console.error(
    "\nPlease provide your deployed site URL, e.g.:\n" +
      "  node scripts/generate-qr.js https://your-deployed-site.vercel.app\n"
  );
  process.exit(1);
}

const registrationUrl = targetUrl.replace(/\/$/, "") + "/#register";
const outputPath = path.join(__dirname, "..", "public", "images", "registration-qr.png");

QRCode.toFile(
  outputPath,
  registrationUrl,
  {
    width: 600,
    margin: 2,
    color: {
      dark: "#1F3A5F",
      light: "#FFFFFF"
    }
  },
  (err) => {
    if (err) {
      console.error("Failed to generate QR code:", err);
      process.exit(1);
    }
    console.log(`\n✔ QR code generated for: ${registrationUrl}`);
    console.log(`  Saved to: ${outputPath}\n`);
  }
);
