import React from "react";

export default function ResumeAnalysisResult({ data }) {
    return (
        <div>
            <h3>Analysis Result</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
