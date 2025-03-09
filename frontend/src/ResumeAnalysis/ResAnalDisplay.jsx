import React from "react";
import "./ResumeAnalysisResult.css"; 

export default function ResumeAnalysisResult({ data }) {
    if (!data || !data.analysis) return null;

    const { strengths, weaknesses, suggestions, match_percentage } = data.analysis;

    return (
        <div className="resume-results">
            <h2 className="analysis-title">Resume Analysis Report</h2>

            {/* Move Match Percentage to the top */}
            <div className="match-percentage highlight">
                <strong>Match Percentage:</strong> {match_percentage}%
            </div>

            <div className="analysis-section">
                <h3>Strengths</h3>
                <ul>
                    {strengths.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>

            <div className="analysis-section">
                <h3>Weaknesses</h3>
                <ul>
                    {weaknesses.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>

            <div className="analysis-section">
                <h3>Suggestions</h3>
                <ul>
                    {suggestions.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
