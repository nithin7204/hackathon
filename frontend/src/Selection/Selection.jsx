import React from "react";
import { useNavigate } from "react-router-dom";

export default function Selection() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Choose an Option</h2>
            <button onClick={() => navigate("/resume-analysis")} className="btn btn-dark">Resume Analysis</button>
            <button onClick={() => navigate("/interview-questions")} class="btn btn-dark">Interview Questions</button>
        </div>
    );
}
