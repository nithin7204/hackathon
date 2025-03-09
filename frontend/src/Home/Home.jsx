import React from "react";
import "./Home.css"; // Importing the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1 className="title">ResumeLens</h1>
        <p className="tagline">Your AI-Powered Career Navigator</p>
      </header>

      <section className="about-section">
        <h2>What is ResumeLens?</h2>
        <p>
          ResumeLens is your smart AI companion that analyzes your resume, understands job requirements, 
          and provides personalized insights. Get AI-driven interview questions, 
          resume improvements, and career suggestions—all in one place!
        </p>
      </section>

      <section className="features-section">
        <h2>Why Choose ResumeLens?</h2>
        <ul>
          <li>🔍 AI-driven resume analysis & insights</li>
          <li>💡 Personalized job interview questions</li>
          <li>⚡ Real-time feedback on strengths & weaknesses</li>
          <li>🚀 Tailored career suggestions for growth</li>
        </ul>
      </section>

      <footer className="footer">
        <p>Empowering Careers with AI 🚀 | ResumeLens</p>
      </footer>
    </div>
  );
};

export default Home;
