import React, { useState } from 'react';
import { userRegister, userLogin } from '../apis/auth';
import { showToast } from './../utils/toast';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from './../utils/auth';
import Div from '../common/Div';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const validationErrors = { ...errors };

    switch (name) {
      case "name":
        if (state === "Sign Up") {
          validationErrors.name = value.trim() ? "" : "Name is required";
        }
        break;
      case "email":
        validationErrors.email = /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email address";
        break;
      case "password":
        validationErrors.password = value.length >= 6 ? "" : "Password must be at least 6 characters long";
        break;
      default:
        break;
    }

    setErrors(validationErrors);
  };

  const validateForm = (data) => {
    const validationErrors = {};

    if (state === "Sign Up" && !data.name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!data.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      validationErrors.email = "Invalid email address";
    }

    if (!data.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }

    return validationErrors;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      let response;


      if (state === "Sign Up") {
        response = await userRegister('/api/register', formData);
        setState('Login');
        showToast(response.message, "success");
      } else {
        response = await userLogin('/api/login', formData);
        let {authorisation, data} = response;
        setToken(authorisation.token);
        setUser(JSON.stringify(data));
        showToast(response.message, "success");
        navigate('/');
      }

    } catch (error) {
      if (error.response) {
        showToast(error.response.data.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <Div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[30px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === "Sign Up" ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign Up" ? "sign up" : "login"} to book appointment</p>

        {state === "Sign Up" && (
          <Div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              required />
            {errors.name && <Div className="invalid-feedback text-red-700">{errors.name}</Div>}
          </Div>
        )}

        <Div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required />
          {errors.email && <Div className="invalid-feedback text-red-700">{errors.email}</Div>}
        </Div>

        <Div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required />
          {errors.password && <Div className="invalid-feedback text-red-700">{errors.password}</Div>}
        </Div>

        <button className='bg-primary text-white w-full py-2 rounded-md text-base' type="submit">
          {loading ? "Loading..." : (state === "Sign Up" ? "Create Account" : "Login")}
        </button>

        {state === "Sign Up" ? (
          <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary cursor-pointer underline'>Login here</span></p>
        ) : (
          <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary cursor-pointer underline'>Click here</span></p>
        )}
      </Div>
    </form>
  );
};

export default Login;
