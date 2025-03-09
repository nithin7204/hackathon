const express = require("express");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();
const upload = multer(); // Using multer memory storage

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Function to extract text from PDF
async function extractResumeContent(pdfBuffer) {
    const data = await pdfParse(pdfBuffer);

    let extractedText = data.text
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Fix camelCase merging
        .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2') // Add space between uppercase words & lowercase start
        .replace(/(\d)([A-Za-z])/g, '$1 $2')  // Fix numbers merging with text
        .replace(/([A-Za-z])(\d)/g, '$1 $2')  // Fix text merging with numbers
        .replace(/([a-zA-Z])\s*([.,])/g, '$1$2') // Remove unnecessary spaces before punctuation
        .replace(/([A-Z])([A-Z]{2,})/g, '$1 $2') // Ensure space between all caps words
        .replace(/\s{2,}/g, ' ') // Remove excessive spaces
        .replace(/\n{2,}/g, '\n') // Remove excessive new lines
        .trim(); // Trim leading/trailing spaces

    return extractedText;
}

// Route for resume analysis
router.post("/", authMiddleware ,upload.single("file"), async (req, res) => {
    console.log("ENTERED INTO RESUEM ANALYSIS ")
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded." });

        const resumeText = await extractResumeContent(req.file.buffer);
        const jobDescription = req.body.jobDescription || "No job description provided.";
        const currentRole = req.body.currentRole || "Not specified";

        const prompt=`
        You are an AI career assistant analyzing a candidate's **resume, job description, and current role**.  
        Generate a **structured assessment** that highlights key insights, focusing on **relevant experience** and **role fit**.
        
        ---
        
        ### **Instructions:**
        - **For Freshers:**  
          - Highlight **internships, hackathons, certifications, and academic projects** that demonstrate relevant skills.  
          - Assess how well the candidate’s coursework and projects align with the job description.  
          - Identify missing skills and suggest improvements.
        
        - **For Experienced Candidates:**  
          - Focus on **industry-level experience, company projects, leadership roles, and deep technical expertise**.  
          - Analyze **the relevance of past projects and technologies** used.  
          - Assess proficiency in **real-world problem-solving, system design, and scalability**.
        
        - **Ensure insights are **specific and contextual**, rather than just listing skills.**  
          -**Bad Example:** "SQL, TensorFlow, Java"  
          - **Good Example:** "2+ years of experience optimizing SQL queries for data analytics and building machine learning models with TensorFlow."
        
        - **Avoid generic responses—make them insightful, role-specific, and customized.**  
        
        ---
        
        ### **Candidate Details:**
        
        **Resume Content:**  
        ${resumeText}  
        
        **Job Description:**  
        ${jobDescription}  
        
        **Current Role & Responsibilities:**  
        ${currentRole}  
        
        ---
        
        ### **Evaluation Criteria:**
        1. **Relevance of technical skills** based on the job description.  
        2. **Depth of experience** with specific tools, technologies, and projects.  
        3. **Gaps between current skills and job requirements.**  
        4. **Optimization suggestions** to increase match percentage.  
        
        ---
        
        ### **Expected JSON Output Format (strictly return JSON, no extra text):**
        {
          "strengths": [
            "2+ years of experience using TensorFlow for deep learning model optimization.",
            "Hands-on experience with SQL, including writing complex queries for data analysis.",
            "Experience leading a team of 3 engineers for backend development using Node.js.",
            "Built and deployed scalable machine learning models in production using AWS."
          ],
          "weaknesses": [
            "Limited hands-on experience with cloud security best practices.",
            "Needs to improve knowledge in designing RESTful APIs."
          ],
          "suggestions": [
            "Enhance experience in cloud computing, especially AWS security best practices.",
            "Work on optimizing REST API performance by implementing caching techniques."
          ],
          "match_percentage": 85%
        }
        `;
        
        const result = await model.generateContent(prompt);
        const rawResponse = result.response.text();
        const cleanedResponse = rawResponse.replace(/```json|```/g, "").trim(); // Remove triple backticks
        res.json({ success: true, analysis: JSON.parse(cleanedResponse) });

    } catch (error) {
        console.error("Error analyzing resume:", error);
        return res.status(500).json({ error: "Failed to process resume." });
    }
});

module.exports = router ;
