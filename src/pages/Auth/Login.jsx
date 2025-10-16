import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hook/useAuth.jsx';
import { useMessage } from '../../contexts/MessageProvider.jsx';
const Login = ({ onModeChange, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const message = useMessage(); // Sử dụng global message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      console.log('Email or password is empty');
      message.warning('Vui lòng nhập đủ Email và Mật khẩu');
      return;
    }
    
    try {
      console.log('Attempting login with:', { email, password });
      await login(email, password);
      message.success('Đăng nhập thành công!');
      onClose(); // Close modal on successful login
    } catch (err) {
      message.error('Đăng nhập thất bại!');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://accounts.google.com';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'https://www.facebook.com';
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Email"
            autoComplete="email"
            // required
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
            placeholder="Mật khẩu"
            autoComplete="password"
            // required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
          </label>
          <button
            type="button"
            onClick={() => onModeChange('forgot')}
            className="text-sm text-red-500 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">hoặc đăng nhập qua</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button 
            onClick={handleGoogleLogin} 
            className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
            aria-label="Đăng nhập với Google"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button 
            onClick={handleFacebookLogin} 
            className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
            aria-label="Đăng nhập với Facebook"
          >
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-center text-gray-600">
        Bạn chưa có tài khoản?{' '}
        <button
          onClick={() => onModeChange('register')}
          className="text-red-500 font-semibold hover:underline"
        >
          Đăng ký
        </button>
      </p>
    </div>
  );
};

export default Login;