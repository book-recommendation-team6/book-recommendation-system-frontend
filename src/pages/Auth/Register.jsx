import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // <-- SỬA EYESLASH THÀNH EYEOFF
import { useAuth } from '../../hook/useAuth.jsx';

const Register = ({ onModeChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, confirmPassword: value }));
    
    // Kiểm tra xem mật khẩu có khớp không
    if (formData.password && value !== formData.password) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Cái này hiện không cần do nút đăng kí đã disable khi không hợp lệ
    try {
      await register(formData);
      onModeChange('login'); // Switch to login after successful registration
    } catch (err) {
      window.alert(err.message);
      return;
    }
    // Handle register logic here
    console.log('Register attempt:', formData);
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... các input khác ... */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Email"
            required
          />
        </div>
        
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Tên đăng nhập"
            required
          />
        </div>
        
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Số điện thoại"
            required
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
            placeholder="Mật khẩu"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* <-- SỬA Ở ĐÂY */}
          </button>
        </div>
        
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12 ${
              passwordMismatch ? 'border-red-500' : 'border-gray-300'
            }`} // Thay đổi màu viền khi lỗi        
            placeholder="Xác nhận Mật khẩu"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* <-- SỬA Ở ĐÂY */}
          </button>
        </div>

        {passwordMismatch && (
          <p className="text-red-500 text-sm">Mật khẩu không khớp.</p>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Đồng ý với điều khoản & chính sách
          </label>
        </div>
        
        <button
          type="submit"

          disabled={passwordMismatch || !formData.password || !formData.confirmPassword}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Đăng ký
        </button>
      </form>
      
      <p className="mt-6 text-center text-gray-600">
        Bạn đã có tài khoản /{' '}
        <button
          onClick={() => onModeChange('login')}
          className="text-red-500 font-semibold hover:underline"
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default Register;