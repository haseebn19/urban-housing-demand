import React from 'react';
import {useTheme} from '../ThemeContext';
import './ProductPitch.css';

const ProductPitch: React.FC = () => {
  const {theme} = useTheme();

  return (
    <section className={`pitch ${theme}`} data-testid="product-pitch">
      <div className="pitch__header">
        <h1 className="pitch__title">Urban Housing Demand</h1>
        <p className="pitch__subtitle">Hamilton vs. Toronto Analysis</p>
      </div>

      <p className="pitch__intro">
        This project analyzes housing needs for different demographic groups and compares them
        with actual housing developments in Hamilton and Toronto. The goal is to provide{' '}
        <strong>data-driven insights</strong> for real estate investors, developers, and policymakers.
      </p>

      <div className="pitch__grid">
        <div className="pitch__card">
          <h2 className="pitch__card-title">Key Objectives</h2>
          <ul className="pitch__list">
            <li>Analyze <strong>housing and employment data</strong> for Hamilton and Toronto</li>
            <li>Identify <strong>housing demand vs. supply gaps</strong> across demographic groups</li>
            <li>Develop <strong>interactive visualizations</strong> for better decision-making</li>
          </ul>
        </div>

        <div className="pitch__card">
          <h2 className="pitch__card-title">Our Approach</h2>
          <ul className="pitch__list">
            <li>Analyze housing trends and <strong>demographic shifts</strong></li>
            <li>Compare data between <strong>two major cities</strong></li>
            <li>Bridge the gap between <strong>supply and demand</strong></li>
          </ul>
        </div>

        <div className="pitch__card">
          <h2 className="pitch__card-title">Target Audiences</h2>
          <ul className="pitch__list">
            <li><strong>Real estate investors</strong> seeking market insights</li>
            <li><strong>Developers</strong> planning new projects</li>
            <li><strong>Policymakers</strong> ensuring sustainable growth</li>
          </ul>
        </div>

        <div className="pitch__card">
          <h2 className="pitch__card-title">Data Sources</h2>
          <ul className="pitch__list">
            <li>Housing starts and completions data</li>
            <li>Labour market statistics by occupation</li>
            <li>Immigration and demographic trends</li>
          </ul>
        </div>
      </div>

      <div className="pitch__cta">
        <p>Explore the data using the navigation above to discover insights about housing trends.</p>
      </div>
    </section>
  );
};

export default ProductPitch;
