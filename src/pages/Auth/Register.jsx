import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hook/useAuth.jsx';
import { validateSignup } from '../../utils/validatorInput.js';

const INITIAL_FORM_STATE = {
  email: '',
  username: '',
  phone_number: '',
  password: '',
  confirmPassword: ''
};

const Register = ({ onModeChange }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorInputs, setErrorInputs] = useState({});
  
  const { register } = useAuth();

  const passwordMismatch = formData.password && 
                          formData.confirmPassword && 
                          formData.password !== formData.confirmPassword;

  const formFields = [
    { 
      id: 'email', 
      type: 'email', 
      placeholder: 'Email', 
      autoComplete: 'email' 
    },
    { 
      id: 'username', 
      type: 'text', 
      placeholder: 'Tên đăng nhập' 
    },
    { 
      id: 'phone_number', 
      type: 'text', 
      placeholder: 'Số điện thoại' 
    },
    {
      id: 'password',
      type: showPassword ? 'text' : 'password',
      placeholder: 'Mật khẩu',
      showToggle: true,
      isVisible: showPassword,
      onToggle: () => setShowPassword(!showPassword)
    },
    {
      id: 'confirmPassword',
      type: showConfirmPassword ? 'text' : 'password',
      placeholder: 'Xác nhận mật khẩu',
      showToggle: true,
      isVisible: showConfirmPassword,
      onToggle: () => setShowConfirmPassword(!showConfirmPassword)
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorInputs({});

    const validationResult = validateSignup(formData);
    
    if (!validationResult.valid) {
      console.log('Validation errors:', validationResult.errors);
      setErrorInputs(validationResult.errors);
      return;
    }

    try {
      await register(formData);
      window.alert('Đăng ký thành công!');
      onModeChange('login');
    } catch (err) {
      window.alert(err.message);
    }
  };

  const getFieldError = (fieldId) => {
    if (fieldId === 'confirmPassword' && passwordMismatch) {
      return 'Mật khẩu không khớp.';
    }
    return errorInputs[fieldId];
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.id}>
            <div className="relative">
              <input
                type={field.type}
                name={field.id}
                value={formData[field.id]}
                onChange={handleInputChange}
                autoComplete={field.autoComplete}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={field.placeholder}
                required
              />
              
              {field.showToggle && (
                <button
                  type="button"
                  onClick={field.onToggle}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  aria-label={field.isVisible ? 'Hide password' : 'Show password'}
                >
                  {field.isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
            
            {getFieldError(field.id) && (
              <p className="mt-1 text-xs text-red-500">
                {getFieldError(field.id)}
              </p>
            )}
          </div>
        ))}
        
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