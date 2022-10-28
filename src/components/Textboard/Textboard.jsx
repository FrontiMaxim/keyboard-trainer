import React from 'react';
import './Textboard.css';

function Textboard({rigthPart, remainPart}) {
  return (
    <p className='textboard'>
      <span className="rigthPart">{rigthPart}</span>
      {remainPart}
    </p>
  )
}

export default Textboard;