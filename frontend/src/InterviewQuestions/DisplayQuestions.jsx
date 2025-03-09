import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DisplayQuestions.css";

export default function DisplayQuestions() {
    const location = useLocation();
    const navigate = useNavigate();
    const questions = location.state?.questions || [];

    return (
        <div className="questions-container">
            <h2 className="questions-title">Generated Interview Questions</h2>

            {questions.length === 0 ? (
                <p>No questions found.</p>
            ) : (
                <ul className="questions-list">
                    {questions.map((q, index) => (
                        <li key={index} className="question-item">{q}</li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate("/interview-questions")} className="back-btn">
                Back to Input
            </button>
        </div>
    );
}
