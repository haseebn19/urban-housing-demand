import React, {useContext} from "react";
import {ThemeContext} from "../ThemeContext";

const ProductPitch: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const {theme} = themeContext;

  return (
    <section
      data-testid="product-pitch"
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        color: theme === "dark" ? "#f4f4f4" : "#000000",
        backgroundColor: theme === "dark" ? "#1c1c1c" : "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "left",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
      >
        Urban Housing Demand in Hamilton vs. Toronto
      </h1>

      <p
        style={{
          lineHeight: "1.8",
          fontSize: "1.2rem",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        This project analyzes housing needs for different demographic groups and compares them with actual housing
        developments in Hamilton and Toronto. The goal is to provide <strong>data-driven insights</strong> for real estate
        investors, developers, and policymakers, ensuring <strong>sustainable housing growth</strong>.
      </p>

      {/* Themed Section */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: theme === "dark" ? "#2c2c2c" : "#f8f8f8",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            color: theme === "dark" ? "#ffffff" : "#000000",
            marginBottom: "15px",
          }}
        >
          Key Objectives
        </h2>
        <ul
          style={{
            lineHeight: "1.8",
            fontSize: "1.1rem",
            marginLeft: "20px",
          }}
        >
          <li>Analyze <strong>housing and employment data</strong> for Hamilton and Toronto.</li>
          <li>Identify <strong>housing demand vs. supply gaps</strong> across demographic groups.</li>
          <li>Develop <strong>interactive data visualizations</strong> for better decision-making.</li>
        </ul>
      </div>

      {/* Another Themed Section */}
      <div
        style={{
          padding: "20px",
          backgroundColor: theme === "dark" ? "#2c2c2c" : "#f8f8f8",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            color: theme === "dark" ? "#ffffff" : "#000000",
            marginBottom: "15px",
          }}
        >
          Our Approach
        </h2>
        <p
          style={{
            lineHeight: "1.8",
            fontSize: "1.1rem",
            marginBottom: "15px",
          }}
        >
          We analyze housing trends, employment statistics, and <strong>demographic shifts</strong> to provide
          actionable insights. Our <strong>interactive dashboards</strong> help developers understand housing
          needs across diverse populations.
        </p>
        <p
          style={{
            lineHeight: "1.8",
            fontSize: "1.1rem",
          }}
        >
          By focusing on <strong>Hamilton and Toronto</strong>, we aim to bridge the gap between <strong>housing supply
            and demand</strong>, ensuring that developments meet the needs of <strong>singles, families, and
              underrepresented communities</strong>.
        </p>
      </div>
    </section>
  );
};

export default ProductPitch;
