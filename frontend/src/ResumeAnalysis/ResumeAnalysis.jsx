import React, { useState } from "react";
import axios from "axios";
import ResumeAnalysisResult from "./ResAnalDisplay";
import "./ResumeAnalysis.css";
import "./ResumeInputForm.css";


export default function ResumeUpload() {
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

        axios.post("http://localhost:4000/api/resume", formData, {
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
        <div>
            <h2>Complete Resume Analysis</h2>
            <form className="input-form" onSubmit={handleSubmit}>
                <div>
                    <label>Upload Resume (PDF): </label>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
                <div>
                    <label>Job Description:</label>
                    <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
                </div>
                <div>
                    <label>Current Role:</label>
                    <input type="text" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} />
                </div>
                <button type="submit" disabled={loading}>Analyze Resume</button>
            </form>

            {loading && <p>Analyzing...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Pass analysis result to ResumeAnalysisResult */}
            {response && <ResumeAnalysisResult data={response} />}
        </div>
    );
}
