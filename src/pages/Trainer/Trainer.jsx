import React from 'react';
import PanelTrainer from '../../components/PanelTrainer/PanelTrainer';
import Textboard from '../../components/Textboard/Textboard';
import Keyboard from '../../components/Keyboard/Keyboard';

import './Trainer.css';

function Trainer() {
  return (
    <div className='trainer'>
        <PanelTrainer />
        <Textboard />
        <Keyboard />
    </div>
  )
}

export default Trainer