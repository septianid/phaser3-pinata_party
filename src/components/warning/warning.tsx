import React from 'react';
import PINATA from '../../assets/images/PINATA.png';
import TITLE from '../../assets/images/TITLE.png';
import './warning.css';

const Warning: React.FunctionComponent = () => (
  <section className="warning-container">
    <div className="title">
      <img src={TITLE} alt="Title" />
    </div>
    <div className="warning-content">
      <img src={PINATA} alt="Pinata" />
      <h1>Ada Gangguan!</h1>
      <h2>Pinata hanya dapat dimainkan di hp</h2>
    </div>
  </section>
);

export default Warning;
