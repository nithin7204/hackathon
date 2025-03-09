// Registration.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "", mobile: "" });
    const {setUser} = useContext(AuthContext);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formData);

        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            return alert("Enter a valid Email");
        }

        let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*|[-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;
        if (!mobileRegex.test(formData.mobile)) {
            return alert("Enter a valid Mobile number");
        }

        axios.post("https://hackathon-vxdp.onrender.com/api/auth/signup/request-otp", { email: formData.email })
            .then((res) => {
                alert("OTP sent to your email.");
                navigate("/verify-otp", { state: { email: formData.email } });
            })
            .catch((err) => {
                console.log("Error:", err);
                alert("Error sending OTP. Please try again.");
            });
    }

    return (
        <div className="register-container">
            <form className="register-form">
                <div className="mb-3">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" onChange={handleChange} placeholder="Enter your username" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" onChange={handleChange} placeholder="Enter your email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" onChange={handleChange} placeholder="Enter your password" />
                </div>
                <div className="mb-3">
                    <label htmlFor="mobile">Mobile</label>
                    <input type="text" id="mobile" name="mobile" onChange={handleChange} placeholder="Enter your mobile number" />
                </div>
                <button onClick={handleSubmit} className="register-button">Register</button>
            </form>
        </div>
    );
}
