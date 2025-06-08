import React from 'react';
import { Board } from './components/Board';
import { Charts } from './components/Charts';
import { useLatencyStats } from './hooks/useLatency';
import './index.css';

const allLevels = [
  'Registers','CPU','L1','L2','L3',
  'RAM','SSD','HDD',
  'Net_NYC','Net_UK','Net_AUS',
  'OS','SCSI','HW','PHYS'
];

const App: React.FC = () => {
  const [stats, increment] = useLatencyStats(allLevels);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '1200px' }}>
        <Board onNodeClick={increment} />
      </div>
      <div style={{ width: '1200px', marginTop: '40px' }}>
        <Charts stats={stats} />
      </div>
    </div>
  );
};

export default App;
