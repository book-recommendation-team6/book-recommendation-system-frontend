import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';

const OAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuthTokenAndFetchUser } = useAuth();
    const [message, setMessage] = useState('Đang xác thực...');

    useEffect(() => {
        const handleOAuth2Redirect = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (error) {
                setMessage(`Đăng nhập thất bại: ${error}`);
                setTimeout(() => navigate('/'), 2000);
                return;
            }

            if (token) {
                try {
                    setMessage('Đăng nhập thành công! Đang tải thông tin người dùng...');
                    await setAuthTokenAndFetchUser(token);
                    setMessage('Đăng nhập thành công! Đang chuyển hướng...');
                    setTimeout(() => navigate('/'), 1500);
                } catch (e) {
                    console.error('OAuth redirect error:', e);
                    setMessage('Lỗi khi xử lý đăng nhập.');
                    setTimeout(() => navigate('/'), 2000);
                }
            } else {
                setMessage('Không tìm thấy token xác thực.');
                setTimeout(() => navigate('/'), 2000);
            }
        };

        handleOAuth2Redirect();
    }, [navigate, location.search, setAuthTokenAndFetchUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>{message}</p>
        </div>
    );
};

export default OAuthRedirect;
