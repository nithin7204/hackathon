import React, { useState } from "react";
import axios from "axios";
import "./InterviewQuestions.css"; // Import CSS file

export default function InterviewQuestions() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!file || !jobDescription || !currentRole) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jobDescription);
        formData.append("currentRole", currentRole);

        axios.post("https://hackathon-vxdp.onrender.com/api/questions", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
            .then((res) => {
                setResponse(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error:", err);
                setError("Failed to analyze resume. Please try again.");
                setLoading(false);
            });
    }

    return (
        <div className="interview-container">
            <h2 className="interview-title">Expected Interview Questions</h2>
            <form className="interview-form" onSubmit={handleSubmit}>
                <div className="interview-form-group">
                    <label>Upload Resume (PDF): </label>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
                <div className="interview-form-group">
                    <label>Job Description:</label>
                    <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
                </div>
                <div className="interview-form-group">
                    <label>Current Role:</label>
                    <input type="text" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} />
                </div>
                {error && <p className="interview-error-message">{error}</p>}
                <button type="submit" className="interview-btn" disabled={loading}>
                    {loading ? "Analyzing..." : "Generate Questions"}
                </button>
            </form>

            {response && response.analysis && response.analysis.technical_questions && (
                <div className="interview-results">
                    <h3>Technical Interview Questions</h3>
                    <ul>
                        {response.analysis.technical_questions.map((question, index) => (
                            <li key={index}>{question}</li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}
