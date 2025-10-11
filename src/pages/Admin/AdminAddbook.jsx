import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, Upload, message } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Camera } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const { TextArea } = Input;
const { Option } = Select;

const AdminAddbook = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [coverImage, setCoverImage] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Mock genres data
  const genres = [
    "Công nghệ",
    "Văn học",
    "Kinh tế",
    "Tâm lý",
    "Khoa học",
    "Lịch sử",
    "Nghệ thuật",
    "Thiếu nhi",
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleCoverImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải lên file ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImage(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleBookFileUpload = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      message.error("Chỉ được tải lên file pdf, doc, docx!");
      return false;
    }
    const isLt25M = file.size / 1024 / 1024 < 25;
    if (!isLt25M) {
      message.error("File phải nhỏ hơn 25MB!");
      return false;
    }

    setBookFile(file);
    return false;
  };

  const handleRemoveBookFile = () => {
    setBookFile(null);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
  };

  const handleGenreChange = (value) => {
    setSelectedGenres(value);
  };

  const handleRemoveGenre = (genreToRemove) => {
    const newGenres = selectedGenres.filter((genre) => genre !== genreToRemove);
    setSelectedGenres(newGenres);
    form.setFieldsValue({ genre: newGenres });
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    console.log("Cover image:", coverImage);
    console.log("Book file:", bookFile);
    message.success("Lưu sách thành công!");
    // Add API call here
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-3 items-center border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="justify-self-start inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftOutlined className="text-lg" />
          </button>

          <h1 className="justify-self-center text-3xl font-bold text-indigo-600">
            Thêm sách mới
          </h1>

          {/* cột phải trống để cân đối */}
          <div />
        </div>

        {/* Form Content */}
        <div className="sm:px-6 lg:px-8 py-6 ">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column - Book Information */}
            <div className="lg:col-span-2 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Thông tin sách
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Book Title */}
                <Form.Item
                  name="title"
                  label={
                    <span className="text-gray-700 font-medium">Tên sách</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sách" },
                  ]}
                  className="mb-4"
                >
                  <Input
                    placeholder="Clean code"
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                {/* Author */}
                <Form.Item
                  name="author"
                  label={
                    <span className="text-gray-700 font-medium">Tác giả</span>
                  }
                  rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
                  className="mb-4"
                >
                  <Input
                    placeholder="Robert C. Martin"
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                {/* Publisher */}
                <Form.Item
                  name="publisher"
                  label={
                    <span className="text-gray-700 font-medium">
                      Nhà xuất bản
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập nhà xuất bản" },
                  ]}
                  className="mb-4"
                >
                  <Input
                    placeholder="NXB Dân Trí"
                    className="rounded-lg"
                    size="large"
                  />
                </Form.Item>

                {/* Publication Year */}
                <Form.Item
                  name="year"
                  label={
                    <span className="text-gray-700 font-medium">
                      Năm xuất bản
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập năm xuất bản" },
                  ]}
                  className="mb-4"
                >
                  <Input
                    placeholder="2022"
                    className="rounded-lg"
                    size="large"
                    type="number"
                  />
                </Form.Item>
              </div>

              {/* Genre */}
              <Form.Item
                name="genre"
                label={
                  <span className="text-gray-700 font-medium">Thể loại</span>
                }
                rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
                className="mb-4"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn thể loại"
                  className="rounded-lg"
                  size="large"
                  onChange={handleGenreChange}
                  value={selectedGenres}
                  tagRender={(props) => {
                    const { label, closable, onClose } = props;
                    return (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-md mr-2 mb-1">
                        {label}
                        {closable && (
                          <CloseCircleOutlined
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                          />
                        )}
                      </span>
                    );
                  }}
                >
                  {genres.map((genre) => (
                    <Option key={genre} value={genre}>
                      {genre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Description */}
              <Form.Item
                name="description"
                label={<span className="text-gray-700 font-medium">Mô tả</span>}
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                className="mb-4"
              >
                <TextArea
                  rows={6}
                  placeholder="Clean code (mã sạch) là cách viết mã nguồn rõ ràng, dễ đọc, dễ hiểu và dễ bảo trì..."
                  className="rounded-lg"
                />
              </Form.Item>

              {/* Book File Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium ">
                    Tải sách lên
                  </label>
                  <Upload.Dragger
                    beforeUpload={handleBookFileUpload}
                    showUploadList={false}
                    className="rounded-lg"
                  >
                    <div className="py-8">
                      <p className="text-gray-600 mb-2">
                        Kéo thả file hoặc chọn
                      </p>
                      <p className="text-gray-400 text-sm">
                        Format: pdf, docx, doc & Max file size: 25 MB
                      </p>
                    </div>
                  </Upload.Dragger>
                </div>

                {/* Format */}
                <Form.Item
                  name="format"
                  label={
                    <span className="text-gray-700 font-medium">Định dạng</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn định dạng" },
                  ]}
                >
                  <Select placeholder="pdf" className="rounded-lg" size="large">
                    <Option value="pdf">pdf</Option>
                    <Option value="docx">docx</Option>
                    <Option value="doc">doc</Option>
                  </Select>
                </Form.Item>
                {bookFile && (
                  <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 text-2xl">📄</span>
                      <span className="text-gray-700">{bookFile.name}</span>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveBookFile}
                    />
                  </div>
                )}
              </div>
              <div className="lg:col-span-3 flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-teal-500 hover:bg-teal-600 border-none rounded-lg px-12 py-2 h-auto text-base font-medium"
                >
                  Lưu sách
                </Button>
              </div>
            </div>

            {/* Right Column - Cover Image */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Ảnh bìa
                </h2>
                <Upload.Dragger
                  beforeUpload={handleCoverImageUpload}
                  showUploadList={false}
                  className="rounded-lg"
                >
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={coverImage || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-80 object-cover rounded-lg"
                      />
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCoverImage();
                        }}
                        className="absolute top-2 right-2"
                      >
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <div className="py-20">
                      <div className="text-gray-300 text-6xl mb-4"><Camera className=" mx-auto" size={48} /></div>
                      <p className="text-gray-600">Tải ảnh lên</p>
                    </div>
                  )}
                </Upload.Dragger>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddbook;
