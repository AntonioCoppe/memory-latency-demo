import React from 'react';

const items = [
  { color:'#f44336', label:'Registers'            },
  { color:'#2196f3', label:'CPU Core'             },
  { color:'#3949ab', label:'L1 Cache'             },
  { color:'#5e35b1', label:'L2 Cache'             },
  { color:'#8e24aa', label:'L3 Cache'             },
  { color:'#4caf50', label:'RAM'                  },
  { color:'#ff9800', label:'SSD'                  },
  { color:'#795548', label:'HDD'                  },
  { color:'#009688', label:'Network (SF → …)'     },
  { color:'#e91e63', label:'OS Reboot'            },
  { color:'#ff5722', label:'SCSI Timeout'         },
  { color:'#cc7722', label:'HW Virtualization'    },
  { color:'#212121', label:'System Reboot'        }
];

export const Legend: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      margin: '16px 0',
      fontSize: '12px',
      color: '#eee'
    }}
  >
    {items.map(item => (
      <div
        key={item.label}
        style={{ display: 'flex', alignItems: 'center', margin: '4px 12px' }}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            background: item.color,
            marginRight: '6px',
            border: '1px solid #444'
          }}
        />
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);
