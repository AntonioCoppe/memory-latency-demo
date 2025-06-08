// src/components/Board.tsx
import React from 'react'

// Props: callback to notify parent which level was clicked
export interface BoardProps {
  onNodeClick: (level: string) => void
}

// Real‐world latencies (ms, log-scaled for animation)
const durations: Record<string, number> = {
  Registers:   0.3,
  CPU:         0.3,
  L1:          0.9,
  L2:          2.8,
  L3:         12.9,
  RAM:       120,
  SSD:     10_000,
  HDD:    550_000,
  Net_NYC: 4_000_000,
  Net_UK:   8_100_000,
  Net_AUS: 18_300_000,
  OS:     400_000_000,
  SCSI: 3_000_000_000,
  HW:    4_000_000_000,
  PHYS: 30_000_000_000
}

// Each node’s id, data-lat key, label, and absolute CSS positioning
const nodes = [
  { id: 'l3',        dataLat: 'L3',       label: 'L3',            style: { width: '340px', height: '340px', border: '2px dashed #8e24aa', top: '180px', left: '430px' } },
  { id: 'l2',        dataLat: 'L2',       label: 'L2',            style: { width: '280px', height: '280px', border: '2px dashed #5e35b1', top: '210px', left: '460px' } },
  { id: 'l1',        dataLat: 'L1',       label: 'L1',            style: { width: '220px', height: '220px', border: '2px dashed #3949ab', top: '240px', left: '490px' } },
  { id: 'cpu-socket',dataLat: 'CPU',      label: 'CPU',           style: { width: '160px', height: '160px', background: '#2196f3',      top: '280px', left: '520px' } },
  { id: 'regs',      dataLat: 'Registers',label: 'Regs',         style: { width:  '80px', height:  '80px', background: '#f44336',      top: '310px', left: '550px' } },
  { id: 'ram1',      dataLat: 'RAM',      label: 'RAM',           style: { width:  '40px', height: '200px', background: '#4caf50',      top: '240px', left: '780px' } },
  { id: 'ram2',      dataLat: 'RAM',      label: 'RAM',           style: { width:  '40px', height: '200px', background: '#4caf50',      top: '240px', left: '830px' } },
  { id: 'ram3',      dataLat: 'RAM',      label: 'RAM',           style: { width:  '40px', height: '200px', background: '#4caf50',      top: '240px', left: '880px' } },
  { id: 'ram4',      dataLat: 'RAM',      label: 'RAM',           style: { width:  '40px', height: '200px', background: '#4caf50',      top: '240px', left: '930px' } },
  { id: 'ssd',       dataLat: 'SSD',      label: 'SSD',           style: { width: '100px', height:  '60px', background: '#ff9800',      top: '480px', left: '800px' } },
  { id: 'hdd',       dataLat: 'HDD',      label: 'HDD',           style: { width: '120px', height:  '50px', background: '#795548',      top: '550px', left: '780px' } },
  { id: 'net-nyc',   dataLat: 'Net_NYC',  label: 'SF→NYC',        style: { width: '100px', height:  '30px', background: '#009688',      top: '580px', left:  '20px' } },
  { id: 'net-uk',    dataLat: 'Net_UK',   label: 'SF→UK',         style: { width: '100px', height:  '30px', background: '#009688',      top: '620px', left:  '20px' } },
  { id: 'net-aus',   dataLat: 'Net_AUS',  label: 'SF→AUS',        style: { width: '120px', height:  '30px', background: '#009688',      top: '660px', left:  '20px' } },
  { id: 'os',        dataLat: 'OS',       label: 'OS Reboot',     style: { width: '120px', height:  '30px', background: '#e91e63',      top: '580px', left: '1040px' } },
  { id: 'scsi',      dataLat: 'SCSI',     label: 'SCSI Timeout',  style: { width: '120px', height:  '30px', background: '#ff5722',      top: '620px', left: '1040px' } },
  { id: 'hwv',       dataLat: 'HW',       label: 'HW Virt',       style: { width: '120px', height:  '30px', background: '#cc7722',      top: '660px', left: '1040px' } },
  { id: 'phy',       dataLat: 'PHYS',     label: 'System Reboot', style: { width: '140px', height:  '30px', background: '#212121',      top: '700px', left: '1040px' } }
]

export const Board: React.FC<BoardProps> = ({ onNodeClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const key = el.dataset.lat!
    onNodeClick(key)

    const duration = durations[key]
    if (!duration) return

    // create & position packet
    const packet = document.createElement('div')
    packet.className = 'packet'
    document.body.appendChild(packet)

    const from = el.getBoundingClientRect()
    packet.style.left = `${from.left + from.width/2 - 6}px`
    packet.style.top  = `${from.top  + from.height/2 - 6}px`

    // compute delta to CPU
    const cpu = document.getElementById('cpu-socket')!
    const cpuRect = cpu.getBoundingClientRect()
    const dx = cpuRect.left + cpuRect.width/2 - (from.left + from.width/2)
    const dy = cpuRect.top  + cpuRect.height/2 - (from.top  + from.height/2)

    // animate & cleanup
    packet.animate(
      [{ transform: 'translate(0,0)' }, { transform: `translate(${dx}px,${dy}px)` }],
      { duration, easing: 'linear' }
    ).onfinish = () => packet.remove()
  }

  return (
    <div>
      <h1>Memory Latency on a Motherboard</h1>
      <div id="board">
        {nodes.map(node => (
          <div
            key={node.id}
            id={node.id}
            className="mem"
            data-lat={node.dataLat}
            style={node.style}
            onClick={handleClick}
          >
            <span className="label">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
