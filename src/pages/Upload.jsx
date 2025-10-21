import React, { useState } from "react";
import axios from "axios";

function Upload(props) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Vui lòng chọn file PDF");
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Chỉ hỗ trợ file PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        {
            withCredentials: true, // QUAN TRỌNG: để cookie httpOnly gửi kèm
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(`Upload thành công: ${response.data}`);
    } catch (error) {
      setMessage(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Upload PDF to MinIO via Java Server</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default Upload;
