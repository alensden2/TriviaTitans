import React from 'react';
import Lex from './Lex';

const LexLayout = () => {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, opacity: 1 }}>
      {/* Add any other common components or layout elements here */}
      <Lex />
    </div>
  );
};

export default LexLayout;