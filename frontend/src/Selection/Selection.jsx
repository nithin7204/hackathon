import React from "react";
import { useNavigate } from "react-router-dom";
import "./Selection.css"; // Import the CSS file

export default function Selection() {
    const navigate = useNavigate();

    return (
        <div className="selection-container">
            <h2>Welcome to Career Assistant</h2>
            <p>Select an option below to proceed:</p>

            <div className="features-container">
                <div className="feature">
                    <h3>📄 Resume Analysis</h3>
                    <p>Upload your resume to get an AI-driven evaluation, including strengths, weaknesses, and improvement suggestions.</p>
                    <button onClick={() => navigate("/resume-analysis")} className="btn">
                        Resume Analysis
                    </button>
                </div>

                <div className="feature">
                    <h3>🎤 Interview Questions</h3>
                    <p>Prepare for your interviews with AI-curated questions tailored to your job role and experience level.</p>
                    <button onClick={() => navigate("/interview-questions")} className="btn">
                        Interview Questions
                    </button>
                </div>
            </div>
        </div>
    );
}
