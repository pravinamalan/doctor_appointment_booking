import React from 'react'
import { getRole} from './../utils/auth';
import { useNavigate } from 'react-router-dom';
import Div from '../common/Div';

const NotFoundPage = () => {
    const role = getRole('role');

    const navigate = useNavigate();
    const backToHome = () =>{
        if(role == "role"){
            navigate('/')
        }else if(role == "Admin"){
            navigate('/admin/dashboard')
        }else{
            navigate('/doctor/dashboard')
        }
    }

  return (
    <Div className="flex flex-col items-center justify-center h-screen bg-gray-100">  

      <h1 className="text-9xl  font-bold text-gray-800">404</h1>
      <p className="text-2xl font-medium text-gray-600">Page Not Found</p>
      <button onClick={backToHome} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
        Go Back Home
      </button>
    </Div>
  )
}

export default NotFoundPage
