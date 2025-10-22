import { useState } from "react";
import { axiosClient } from "../utils/axiousClient";

export default function UploadDirect() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const onChoose = (e) => setFile(e.target.files?.[0] || null);

  const send = async () => {
    if (!file) return setMsg("Chọn file PDF trước đã");
    if (file.type !== "application/pdf") return setMsg("Chỉ nhận PDF");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const { data } = await axiosClient.post("/api/v1/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg(`OK: ${data.key}`);
    } catch (e) {
      setMsg(e?.response?.data?.error || e.message);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onChoose} />
      <button onClick={send}>Upload</button>
      <p>{msg}</p>
    </div>
  );
}
