import { useState, FormEvent, ChangeEvent } from "react";

import Auth from '../utils/auth';
import { login } from "../api/authAPI";
import { UserLogin } from "../interfaces/UserLogin";

const Login = () => {
  const [loginData, setLoginData] = useState<UserLogin>({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleCursor = async (T: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = T.target
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const reply = await response.json();

    if (name === "username" && value.trim() === "") {
      setErrors((error) => ({ ...error, username: "Username is required." }));
      } else if (name === "username"){
          setErrors((error) => ({ ...error, username: "" }));
        }

    if (name === "password" && value.trim() === "") {
      setErrors((error) => ({ ...error, password: "Password is required." }));
      } else if (name === "password"){
          setErrors((error) => ({ ...error, password: "" }));
        }
    
    return reply;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(loginData);
      Auth.login(data.token);
    } catch (err) {
      setErrors((error) => ({ ...error, username: "credentials are incorrect" }));
      console.error('Failed to login', err, loginData);
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label >Username</label>
        <input 
          type='text'
          name='username'
          value={loginData.username || ''}
          onChange={handleChange}
          onBlur={handleCursor}
          required
        />
        {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
      <label>Password</label>
        <input 
          type='password'
          name='password'
          value={loginData.password || ''}
          onChange={handleChange}
          onBlur={handleCursor}
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        <button type='submit'>Submit Form</button>
      </form>
    </div>
    
  )
};

export default Login;
