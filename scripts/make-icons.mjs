// Generates public/icon-192.png and icon-512.png (no external deps)
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};

function icon(size) {
  const px = (x, y) => {
    const u = x / size, v = y / size;
    // background gradient indigo
    let r = 79 + (99 - 79) * v, g = 70 + (102 - 70) * v, b = 229 + (241 - 229) * v;
    // white clock ring
    const dx = u - 0.5, dy = v - 0.5, d = Math.hypot(dx, dy);
    const ring = d > 0.27 && d < 0.33;
    // clock hands
    const hand1 = Math.abs(dx) < 0.025 && dy < 0 && dy > -0.2;
    const hand2 = Math.abs(dy) < 0.025 && dx > 0 && dx < 0.15;
    const dot = d < 0.04;
    if (ring || hand1 || hand2 || dot) r = g = b = 255;
    return [r | 0, g | 0, b | 0, 255];
  };
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = px(x, y);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0)),
  ]);
}

writeFileSync("public/icon-192.png", icon(192));
writeFileSync("public/icon-512.png", icon(512));
console.log("icons written");
