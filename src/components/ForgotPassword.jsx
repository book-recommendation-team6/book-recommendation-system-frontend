import React, { useState } from 'react';

const ForgotPassword = ({ onModeChange }) => {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log('Forgot password for:', identifier);
    // After successful submission, you might want to switch to confirm password mode
    // onModeChange('confirm');
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Email/ Số điện thoại/Tên đăng nhập"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Xác nhận
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => onModeChange('login')}
          className="text-red-500 hover:underline"
        >
          Trở lại đăng nhập
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;