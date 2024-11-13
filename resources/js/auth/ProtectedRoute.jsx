import React, { useEffect } from 'react'
import { getToken, setRole } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const token = getToken('token');
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
          navigate('/admin/login');
        }

    }, [token, navigate]);

    return <>{children}</>;
}

export default ProtectedRoute
