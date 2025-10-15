import React, { useState } from "react";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";
import LightweightEpubReader from "./LightweightEpubReader";

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PdfToEpub() {
  const [epubBlob, setEpubBlob] = useState(null);
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [inputMode, setInputMode] = useState("file"); // "file" or "url"
  const [fontFamily, setFontFamily] = useState("Georgia, serif");
  const [fontSize, setFontSize] = useState("1.0em");
  const [lineHeight, setLineHeight] = useState("1.5");
  const [margin, setMargin] = useState("1em");
  const [status, setStatus] = useState("");

  const handleConvert = async () => {
    try {
      setStatus("Đang đọc PDF...");

      let buf;
      if (inputMode === "url") {
        if (!pdfUrl.trim()) return alert("Vui lòng nhập URL của file PDF.");
        try {
          setStatus("Đang tải PDF từ URL...");
          const response = await fetch(pdfUrl);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          buf = await response.arrayBuffer();
        } catch (err) {
          console.error(err);
          return alert(
            "Không thể tải PDF từ URL. Kiểm tra lại URL hoặc CORS policy."
          );
        }
      } else {
        if (!file) return alert("Chọn một file PDF trước đã.");
        buf = await file.arrayBuffer();
      }

      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const pageCount = pdf.numPages;

      // Check if PDF is too large
      if (pageCount > 100) {
        const confirm = window.confirm(
          `PDF có ${pageCount} trang. Quá trình conversion có thể mất nhiều thời gian. Tiếp tục?`
        );
        if (!confirm) {
          setStatus("");
          return;
        }
      }

      // Extract text content from each page with formatting
      const pageContents = [];

      // Extract text content from each page with formatting
      for (let i = 1; i <= pageCount; i++) {
        setStatus(`Đang xử lý trang ${i}/${pageCount}... (${Math.round((i/pageCount)*100)}%)`);
        
        // Allow UI to update
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const page = await pdf.getPage(i);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        // Extract text content
        const textContent = await page.getTextContent({
          normalizeWhitespace: false,
          disableCombineTextItems: false,
        });

        // Extract images from page
        const ops = await page.getOperatorList();
        const images = [];
        
        for (let j = 0; j < ops.fnArray.length; j++) {
          if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject || 
              ops.fnArray[j] === pdfjsLib.OPS.paintInlineImageXObject ||
              ops.fnArray[j] === pdfjsLib.OPS.paintJpegXObject) {
            
            const imageName = ops.argsArray[j][0];
            try {
              const image = await page.objs.get(imageName);
              if (image) {
                // Convert image to data URL
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                
                const imageData = ctx.createImageData(image.width, image.height);
                if (image.data) {
                  imageData.data.set(image.data);
                  ctx.putImageData(imageData, 0, 0);
                  const imgDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                  
                  images.push({
                    dataUrl: imgDataUrl,
                    width: image.width,
                    height: image.height
                  });
                }
                canvas.width = 0;
                canvas.height = 0;
              }
            } catch (err) {
              console.log('Could not extract image:', err);
            }
          }
        }

        function cssEscape(s) {
          return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        }

        // Group text items by line (same Y position)
        const lines = [];
        const lineThreshold = 8; // pixels tolerance for same line
        
        for (const item of textContent.items) {
          if (!item.str.trim()) continue;
          
          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
          const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
          const left = tx[4];
          const top = tx[5];
          
          // Find existing line or create new one
          let foundLine = lines.find(line => Math.abs(line.top - top) < lineThreshold);
          
          if (!foundLine) {
            foundLine = { top, items: [] };
            lines.push(foundLine);
          }
          
          foundLine.items.push({
            text: item.str,
            left,
            fontHeight
          });
        }
        
        // Sort lines by Y position, sort items in each line by X position
        lines.sort((a, b) => a.top - b.top);
        lines.forEach(line => {
          line.items.sort((a, b) => a.left - b.left);
        });

        // Build HTML content with text and images
        let htmlContent = `<div class="page" style="max-width: 800px; margin: 0 auto; padding: 1em;">`;

        // Add images first
        for (const img of images) {
          htmlContent += `
  <div style="margin: 1em 0; text-align: center;">
    <img src="${img.dataUrl}" 
         alt="Image" 
         style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />
  </div>`;
        }

        // Add text content by paragraphs
        let currentParagraph = [];
        let lastTop = -999;
        
        for (const line of lines) {
          const lineText = line.items.map(item => cssEscape(item.text)).join(' ').trim();
          
          // Check if this is a new paragraph (large gap between lines)
          if (line.top - lastTop > 30 && currentParagraph.length > 0) {
            // Close current paragraph
            htmlContent += `
  <p style="
    margin: 0.8em 0;
    line-height: 1.6;
    text-align: justify;
    user-select: text;
    -webkit-user-select: text;">
    ${currentParagraph.join(' ')}
  </p>`;
            currentParagraph = [];
          }
          
          if (lineText) {
            currentParagraph.push(lineText);
          }
          lastTop = line.top;
        }
        
        // Add remaining paragraph
        if (currentParagraph.length > 0) {
          htmlContent += `
  <p style="
    margin: 0.8em 0;
    line-height: 1.6;
    text-align: justify;
    user-select: text;
    -webkit-user-select: text;">
    ${currentParagraph.join(' ')}
  </p>`;
        }

        htmlContent += `</div>`;
        pageContents.push({ index: i, htmlContent, images });
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
      const PAGES = OEBPS.folder("pages");

      // 3) CSS (tuỳ chỉnh font/size/line-height/margin)
      const css = `
html, body { 
  margin: 0; 
  padding: 0; 
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
}
body {
  font-family: ${fontFamily};
  font-size: ${fontSize};
  line-height: ${lineHeight};
  margin: ${margin};
  overflow-x: hidden;
  cursor: text;
  background: #fff;
  color: #333;
}
.page {
  user-select: text !important;
  -webkit-user-select: text !important;
  margin-bottom: 2em;
}
.page img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
  border-radius: 4px;
}
.page p {
  user-select: text !important;
  -webkit-user-select: text !important;
  cursor: text;
  margin: 0.8em 0;
  text-align: justify;
}
h1, h2, h3, h4, h5, h6 { 
  line-height: 1.25; 
  margin: .6em 0 .3em; 
  font-weight: 600;
}
      `.trim();
      OEBPS.file("style.css", css, { compression: "DEFLATE" });

      // 4) Tạo manifest và spine
      const manifestItems = [];
      const spineItems = [];

      // Trang title
      const safeTitle = (
        file?.name ||
        pdfUrl.split("/").pop() ||
        "book.pdf"
      ).replace(/\.pdf$/i, "");
      const titlePageXhtml = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${safeTitle}</title><link rel="stylesheet" type="text/css" href="../style.css"/></head>
<body>
  <h1>${safeTitle}</h1>
  <p>Generated from PDF (${pageCount} pages).</p>
  <p>Text extracted and copyable.</p>
</body>
</html>`;
      PAGES.file("title.xhtml", titlePageXhtml);
      manifestItems.push(
        `<item id="title" href="pages/title.xhtml" media-type="application/xhtml+xml"/>`
      );
      spineItems.push(`<itemref idref="title"/>`);

      // Tạo mỗi trang một xhtml với text content và formatting
      for (const { index, htmlContent } of pageContents) {
        const xhtmlName = `page-${index}.xhtml`;

        // Xhtml cho trang với positioned text content
        const pageXhtml = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Page ${index}</title><link rel="stylesheet" type="text/css" href="../style.css"/></head>
<body>
  ${htmlContent}
</body>
</html>`;

        PAGES.file(xhtmlName, pageXhtml);
        manifestItems.push(
          `<item id="p${index}" href="pages/${xhtmlName}" media-type="application/xhtml+xml"/>`
        );
        spineItems.push(`<itemref idref="p${index}"/>`);
      }

      // 5) content.opf (manifest + spine)
      const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${safeTitle}</dc:title>
    <dc:language>vi</dc:language>
    <dc:creator>PDF2EPUB (client-side text extraction)</dc:creator>
    <dc:identifier id="bookid">urn:uuid:${
      crypto.randomUUID ? crypto.randomUUID() : Date.now()
    }</dc:identifier>
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

      // 6) TOC tối giản (EPUB2 .ncx)
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
    ${pageContents
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
      const blob = await zip.generateAsync({
        type: "blob",
        mimeType: "application/epub+zip",
      });
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
        <div
          style={{
            maxWidth: 720,
            margin: "24px auto",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h2>PDF → EPUB (Text Extraction)</h2>

          <div style={{ display: "grid", gap: 12 }}>
            {/* Input Mode Toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button
                onClick={() => setInputMode("file")}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border:
                    inputMode === "file"
                      ? "2px solid #2563eb"
                      : "1px solid #ccc",
                  background: inputMode === "file" ? "#eff6ff" : "white",
                  cursor: "pointer",
                  fontWeight: inputMode === "file" ? "600" : "normal",
                }}
              >
                📁 Upload File
              </button>
              <button
                onClick={() => setInputMode("url")}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border:
                    inputMode === "url"
                      ? "2px solid #2563eb"
                      : "1px solid #ccc",
                  background: inputMode === "url" ? "#eff6ff" : "white",
                  cursor: "pointer",
                  fontWeight: inputMode === "url" ? "600" : "normal",
                }}
              >
                🔗 Từ URL
              </button>
            </div>

            {/* File Input or URL Input */}
            {inputMode === "file" ? (
              <label>
                PDF file
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            ) : (
              <label>
                PDF URL
                <input
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://example.com/document.pdf"
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    width: "100%",
                    fontSize: "14px",
                  }}
                />
                <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                  ⚠️ Lưu ý: URL cần hỗ trợ CORS hoặc từ cùng domain
                </div>
              </label>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <label>
                Font family
                <input
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  placeholder='e.g. "Georgia, serif"'
                />
              </label>
              <label>
                Font size
                <input
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  placeholder="e.g. 1.0em or 18px"
                />
              </label>
              <label>
                Line height
                <input
                  value={lineHeight}
                  onChange={(e) => setLineHeight(e.target.value)}
                  placeholder="e.g. 1.5"
                />
              </label>
              <label>
                Margin
                <input
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  placeholder="e.g. 1em"
                />
              </label>
            </div>

            <button
              onClick={handleConvert}
              disabled={inputMode === "file" ? !file : !pdfUrl.trim()}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: (inputMode === "file" ? !file : !pdfUrl.trim())
                  ? "#e5e7eb"
                  : "#2563eb",
                color: (inputMode === "file" ? !file : !pdfUrl.trim())
                  ? "#9ca3af"
                  : "white",
                border: "none",
                cursor: (inputMode === "file" ? !file : !pdfUrl.trim())
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "600",
              }}
            >
              Convert to EPUB
            </button>

            {status && (
              <div style={{ 
                padding: "12px", 
                background: "#f0f9ff",
                border: "1px solid #bfdbfe",
                borderRadius: 8,
                fontSize: 14,
                color: "#1e40af",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <div className="animate-spin" style={{
                  width: 16,
                  height: 16,
                  border: "2px solid #bfdbfe",
                  borderTopColor: "#2563eb",
                  borderRadius: "50%"
                }}></div>
                <span>{status}</span>
              </div>
            )}

            <div style={{ fontSize: 12, color: "#666" }}>
              * Lưu ý: Đây là chuyển PDF → EPUB với văn bản và hình ảnh riêng biệt.
              Text sẽ hiển thị dưới dạng văn bản thật (có thể copy), 
              và hình ảnh từ PDF sẽ được trích xuất và hiển thị đúng vị trí.
              Định dạng tự động căn đoạn văn để dễ đọc.
            </div>
          </div>
        </div>
      ) : (
        <LightweightEpubReader
          blob={epubBlob}
          onClose={() => {
            setEpubBlob(null);
            setStatus("");
          }}
        />
      )}
    </>
  );
}
