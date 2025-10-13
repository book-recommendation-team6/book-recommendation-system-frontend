// src/LightweightEpubReader.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";

export default function LightweightEpubReader({ blob, onClose }) {
  const iframeRef = useRef(null);
  const [spine, setSpine] = useState([]);
  const [manifest, setManifest] = useState({});
  const [title, setTitle] = useState("Untitled");
  const [page, setPage] = useState(1);
  const [dark, setDark] = useState(false);
  const [zip, setZip] = useState(null);

  useEffect(() => {
    (async () => {
      const z = await JSZip.loadAsync(blob);
      setZip(z);

      // 1) Find OPF
      const containerXml = await z.file("META-INF/container.xml").async("text");
      const containerDoc = new DOMParser().parseFromString(containerXml, "application/xml");
      const rootfile = containerDoc.querySelector("rootfile");
      const opfPath = rootfile.getAttribute("full-path"); // "OEBPS/content.opf"

      // 2) Parse OPF → manifest + spine + metadata
      const opfXml = await z.file(opfPath).async("text");
      const opfDoc = new DOMParser().parseFromString(opfXml, "application/xml");
      const ns = (sel) => opfDoc.querySelector(sel);

      setTitle(ns("metadata > title, metadata dc\\:title")?.textContent || "Untitled");

      const manifestMap = {};
      opfDoc.querySelectorAll("manifest > item").forEach((it) => {
        manifestMap[it.getAttribute("href")] = {
          id: it.getAttribute("id"),
          mediaType: it.getAttribute("media-type"),
        };
      });

      const spineHrefs = [];
      opfDoc.querySelectorAll("spine > itemref").forEach((ref) => {
        const idref = ref.getAttribute("idref");
        const href = Object.keys(manifestMap).find((h) => manifestMap[h].id === idref);
        if (href) spineHrefs.push(href);
      });

      setManifest(manifestMap);
      setSpine(spineHrefs);
      setPage(spineHrefs.length > 1 ? 1 : 0); // 0: title.xhtml, 1: page-1.xhtml
    })();
  }, [blob]);

  // helper tạo ObjectURL cho resource trong zip
  const getObjectUrl = useMemo(() => {
    const cache = new Map();
    return async (pathInZip) => {
      if (cache.has(pathInZip)) return cache.get(pathInZip);
      const f = zip?.file(`OEBPS/${pathInZip}`);
      if (!f) return null;
      const mt = manifest[pathInZip]?.mediaType || "application/octet-stream";
      const arr = await f.async("arraybuffer");
      const url = URL.createObjectURL(new Blob([arr], { type: mt }));
      cache.set(pathInZip, url);
      return url;
    };
  }, [zip, manifest]);

  // chuẩn hóa ../
  const normalize = (p) => p.replace(/^(\.\.\/)+/g, "").replace(/^\.\//, "");

  // render 1 trang xhtml vào iframe
  const displayPage = async (index) => {
    if (!zip || !spine.length) return;
    const clamped = Math.max(1, Math.min(spine.length - 1, index)); // bỏ title.xhtml (index 0)
    const href = spine[clamped];
    const xhtml = await zip.file(`OEBPS/${href}`).async("text");

    const doc = new DOMParser().parseFromString(xhtml, "application/xhtml+xml");

    // link stylesheet
    const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    for (const l of links) {
      const href = l.getAttribute("href");
      const clean = normalize(href);
      const url = await getObjectUrl(clean);
      if (url) l.setAttribute("href", url);
    }

    // images
    const imgs = Array.from(doc.querySelectorAll("img[src]"));
    for (const img of imgs) {
      const s = img.getAttribute("src");
      const clean = normalize(s);
      const url = await getObjectUrl(clean);
      if (url) img.setAttribute("src", url);
      img.setAttribute("style", "max-width:100%;height:auto;display:block;margin:0 auto;");
    }

    // theme (nội dung trong iframe nên phải set inline)
    const body = doc.querySelector("body");
    if (body) {
      body.setAttribute(
        "style",
        dark
          ? "background:#0f1220;color:#f1f5f9;margin:1em;line-height:1.5;font-family:Georgia,serif;"
          : "background:#fafafc;color:#111827;margin:1em;line-height:1.5;font-family:Georgia,serif;"
      );
    }

    iframeRef.current.srcdoc = "<!doctype html>\n" + doc.documentElement.outerHTML;
    setPage(clamped);
  };

  useEffect(() => {
    if (spine.length) displayPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spine, dark]);

  const prev = () => displayPage(page - 1);
  const next = () => displayPage(page + 1);

  const totalPages = Math.max(1, spine.length - 1);

  return (
    // Gắn class 'dark' để kích hoạt dark: utilities bên trong
    <div className={`${dark ? "dark" : ""}`}>
      <div className={`fixed inset-0 grid grid-rows-[56px_1fr] ${dark ? "bg-[#0f1220]" : "bg-slate-50"}`}>
        {/* Header */}
        <header
          className={`flex items-center justify-between gap-3 px-4 border-b ${
            dark ? "border-white/10" : "border-black/10"
          }`}
        >
          <button
            onClick={onClose}
            className="text-lg px-2 py-1 rounded hover:scale-105 transition-transform hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Back"
          >
            ←
          </button>

          <div className="font-bold text-lg truncate">{title}</div>

          <div className="flex items-center gap-3">
            <span className={`text-sm ${dark ? "text-slate-200" : "text-slate-700"}`}>
              Trang {Math.max(1, page)}/{totalPages}
            </span>
            <button
              onClick={() => setDark((d) => !d)}
              className="text-lg px-2 py-1 rounded hover:scale-105 transition-transform hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle theme"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="grid grid-cols-[64px_1fr_64px] items-stretch">
          <button
            onClick={prev}
            className="text-3xl opacity-70 hover:opacity-100 transition transform hover:scale-105 text-left pr-3"
            aria-label="Previous page"
          >
            ❮
          </button>

          <div className="w-full h-full max-w-[980px] mx-auto">
            <iframe ref={iframeRef} title="epub" className="w-full h-full border-0" />
          </div>

          <button
            onClick={next}
            className="text-3xl opacity-70 hover:opacity-100 transition transform hover:scale-105 text-right pl-3"
            aria-label="Next page"
          >
            ❯
          </button>
        </main>
      </div>
    </div>
  );
}
