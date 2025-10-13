import React, { useState } from "react";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";
import LightweightEpubReader from "./LightweightEpubReader";

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
// Dùng worker PDF.js từ CDN cho đơn giản (có thể dùng file local nếu muốn)
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;


function dataURLToUint8Array(dataURL) {
  const byteString = atob(dataURL.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  return ia;
}

export default function PdfToEpub() {
  const [epubBlob, setEpubBlob] = useState(null);
  const [file, setFile] = useState(null);
  const [fontFamily, setFontFamily] = useState("Georgia, serif");
  const [fontSize, setFontSize] = useState("1.0em");
  const [lineHeight, setLineHeight] = useState("1.5");
  const [margin, setMargin] = useState("1em");
  const [scale, setScale] = useState(1.6); // render scale; tăng nếu muốn ảnh nét hơn
  const [status, setStatus] = useState("");

  const handleConvert = async () => {
    try {
      if (!file) return alert("Chọn một file PDF trước đã.");
      setStatus("Đang đọc PDF...");

      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const pageCount = pdf.numPages;

      // Render từng trang thành ảnh JPEG (client-side)
      setStatus(`Đang render ${pageCount} trang...`);
      const pageImages = [];
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        // JPEG giúp zip nhỏ hơn PNG
        const dataURL = canvas.toDataURL("image/jpeg", 0.9);
        pageImages.push({ index: i, dataURL });
      }

      // Tạo EPUB (EPUB2 tối giản)
      setStatus("Đang đóng gói EPUB...");
      const zip = new JSZip();

      // 1) mimetype (phải là file đầu tiên, không nén)
      zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

      // 2) container.xml
      zip.folder("META-INF").file(
        "container.xml",
        `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
      );

      const OEBPS = zip.folder("OEBPS");
      const IMAGES = OEBPS.folder("images");
      const PAGES = OEBPS.folder("pages");

      // 3) CSS (tuỳ chỉnh font/size/line-height/margin)
      const css = `
html, body { margin:0; padding:0; }
body {
  font-family: ${fontFamily};
  font-size: ${fontSize};
  line-height: ${lineHeight};
  margin: ${margin};
}
img { max-width: 100%; height: auto; display:block; margin: 0 auto; }
h1,h2,h3,h4,h5,h6 { line-height: 1.25; margin: .6em 0 .3em; }
p { margin: 0 0 .7em; }
      `.trim();
      OEBPS.file("style.css", css, { compression: "DEFLATE" });

      // 4) Lưu ảnh trang vào OEBPS/images
      const manifestItems = [];
      const spineItems = [];

      // Trang title
      const safeTitle = (file.name || "book.pdf").replace(/\.pdf$/i, "");
      const titlePageXhtml = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${safeTitle}</title><link rel="stylesheet" type="text/css" href="../style.css"/></head>
<body>
  <h1>${safeTitle}</h1>
  <p>Generated from PDF (${pageCount} pages).</p>
</body>
</html>`;
      PAGES.file("title.xhtml", titlePageXhtml);
      manifestItems.push(`<item id="title" href="pages/title.xhtml" media-type="application/xhtml+xml"/>`);
      spineItems.push(`<itemref idref="title"/>`);

      // Tạo mỗi trang một xhtml kèm <img> của trang đó
      for (const { index, dataURL } of pageImages) {
        const imgName = `page-${index}.jpg`;
        const xhtmlName = `page-${index}.xhtml`;

        // Lưu ảnh
        const imgBytes = dataURLToUint8Array(dataURL);
        IMAGES.file(imgName, imgBytes, { binary: true });

        // Xhtml cho trang
        const pageXhtml = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Page ${index}</title><link rel="stylesheet" type="text/css" href="../style.css"/></head>
<body>
  <img src="../images/${imgName}" alt="Page ${index}"/>
</body>
</html>`;

        PAGES.file(xhtmlName, pageXhtml);
        manifestItems.push(`<item id="p${index}" href="pages/${xhtmlName}" media-type="application/xhtml+xml"/>`);
        manifestItems.push(`<item id="img${index}" href="images/${imgName}" media-type="image/jpeg"/>`);
        spineItems.push(`<itemref idref="p${index}"/>`);
      }

      // 5) content.opf (manifest + spine)
      const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${safeTitle}</dc:title>
    <dc:language>vi</dc:language>
    <dc:creator>PDF2EPUB (client-side)</dc:creator>
    <dc:identifier id="bookid">urn:uuid:${crypto.randomUUID ? crypto.randomUUID() : Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="css" href="style.css" media-type="text/css"/>
    ${manifestItems.join("\n    ")}
  </manifest>
  <spine toc="ncx">
    ${spineItems.join("\n    ")}
  </spine>
</package>`;
      OEBPS.file("content.opf", contentOpf);

      // 6) TOC tối giản (EPUB2 .ncx; optional nhưng nhiều reader yêu cầu)
      const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${Date.now()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${safeTitle}</text></docTitle>
  <navMap>
    <navPoint id="nav-title" playOrder="1">
      <navLabel><text>Title</text></navLabel>
      <content src="pages/title.xhtml"/>
    </navPoint>
    ${pageImages
      .map(
        ({ index }) => `
    <navPoint id="nav-${index + 1}" playOrder="${index + 2}">
      <navLabel><text>Page ${index}</text></navLabel>
      <content src="pages/page-${index}.xhtml"/>
    </navPoint>`
      )
      .join("")}
  </navMap>
</ncx>`;
      OEBPS.file("toc.ncx", ncx);

    // 7) Xuất .epub
    const blob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
    setEpubBlob(blob);
    setStatus("Đã sẵn sàng đọc ✅");
    } catch (err) {
      console.error(err);
      setStatus("Lỗi ❌ — xem console");
      alert("Conversion failed. Check console.");
    }
  };

  return (
    <>
      {!epubBlob ? (
      <div style={{ maxWidth: 720, margin: "24px auto", fontFamily: "system-ui, sans-serif" }}>
        <h2>PDF → EPUB (client-side)</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <label>
            PDF file
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>
              Font family
              <input value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} placeholder='e.g. "Georgia, serif"' />
            </label>
            <label>
              Font size
              <input value={fontSize} onChange={(e) => setFontSize(e.target.value)} placeholder="e.g. 1.0em or 18px" />
            </label>
            <label>
              Line height
              <input value={lineHeight} onChange={(e) => setLineHeight(e.target.value)} placeholder="e.g. 1.5" />
            </label>
            <label>
              Margin
              <input value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="e.g. 1em" />
            </label>
          </div>

          <label>
            Render scale (ảnh trang)
            <input
              type="number"
              min="0.6"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value || "1.6"))}
            />
          </label>

          <button onClick={handleConvert} disabled={!file} style={{ padding: "10px 14px", borderRadius: 8 }}>
            Convert to EPUB
          </button>

          <div style={{ opacity: 0.8 }}>{status}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            * Lưu ý: Đây là chuyển PDF → EPUB dạng mỗi trang thành ảnh để đảm bảo ổn định.  
            Bạn vẫn có thể chỉnh font/size/line-height/margin ở CSS EPUB reader.  
            Nếu muốn “reflow” chữ (không dùng ảnh), cần pipeline trích text phức tạp hơn.
          </div>
        </div>
      </div>
      ) : ( // === Reader hiển thị toàn màn hình ===
      <LightweightEpubReader
        blob={epubBlob}
        onClose={() => { setEpubBlob(null); setStatus(""); }}
      />)};
    </>
  );
}
