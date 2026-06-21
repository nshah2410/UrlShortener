import { useEffect, useState } from "react";
import QRCode from "qrcode";

// Renders a real, scannable QR code as an <img> data URL.
// `value` is the text to encode; `color` is the foreground module color.
export default function QrCode({ value, color = "#11131a", className, style }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value || " ", {
      margin: 1,
      width: 320,
      color: { dark: color, light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {
        if (active) setSrc("");
      });
    return () => {
      active = false;
    };
  }, [value, color]);

  return (
    <img
      src={src}
      alt={value ? `QR code for ${value}` : "QR code"}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
