// OtpVerify.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OtpVerify() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    function handleVerify(e) {
        e.preventDefault();
        axios.post("https://hackathon-vxdp.onrender.com/api/auth/signup/verify-otp", { email, user_otp: otp })
            .then((res) => {
                alert("OTP verified successfully!");
                navigate("/selection");
            })
            .catch((err) => {
                alert("Invalid OTP or expired OTP.");
            });
    }

    return (
        <div className="otp-container">
            <form className="otp-form">
                <div className="mb-3">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="otp">OTP</label>
                    <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                </div>
                <button onClick={handleVerify} className="otp-button">Verify OTP</button>
            </form>
        </div>
    );
}
