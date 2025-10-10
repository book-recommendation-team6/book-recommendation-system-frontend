import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // <-- SỬA EYESLASH THÀNH EYEOFF

const ConfirmPassword = ({ onModeChange }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password confirmation logic here
    console.log('Password confirmation:', { password, confirmPassword });
    // After successful password reset, you might want to switch back to login
    // onModeChange('login');
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Xác nhận mật khẩu mới</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
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
        
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );
};

export default ConfirmPassword;