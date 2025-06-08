// src/components/Board.tsx
import React from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

export interface BoardProps {
  onNodeClick: (level: string) => void
}

// Raw durations in ms (log-scaled)
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

// Human-readable labels
const descriptions: Record<string,string> = {
  Registers: 'On-core register file',
  CPU:       'Processor core executing instructions',
  L1:        'Per-thread, on-core cache',
  L2:        'Shared on-core cache',
  L3:        'Off-core last-level cache',
  RAM:       'Main system memory (DRAM)',
  SSD:       'Solid-state drive storage',
  HDD:       'Magnetic disk-based storage',
  Net_NYC:   'Network (SF → New York)',
  Net_UK:    'Network (SF → U.K.)',
  Net_AUS:   'Network (SF → Australia)',
  OS:        'OS context switch / reboot',
  SCSI:      'SCSI bus timeout event',
  HW:        'Hardware virtualization overhead',
  PHYS:      'Full system reboot'
}

// Layout data
const nodes = [
  { id: 'l3', dataLat: 'L3',  label: 'L3',  style: { width:'340px', height:'340px', border:'2px dashed #8e24aa', top:'180px', left:'430px' } },
  { id: 'l2', dataLat: 'L2',  label: 'L2',  style: { width:'280px', height:'280px', border:'2px dashed #5e35b1', top:'210px', left:'460px' } },
  { id: 'l1', dataLat: 'L1',  label: 'L1',  style: { width:'220px', height:'220px', border:'2px dashed #3949ab', top:'240px', left:'490px' } },
  { id:'cpu-socket', dataLat:'CPU',      label:'CPU',           style:{ width:'160px', height:'160px', background:'#2196f3', top:'280px', left:'520px' } },
  { id:'regs',       dataLat:'Registers',label:'Regs',         style:{ width:'80px',  height:'80px',  background:'#f44336', top:'310px', left:'550px' } },
  { id:'ram1',       dataLat:'RAM',      label:'RAM',          style:{ width:'40px',  height:'200px', background:'#4caf50', top:'240px', left:'780px' } },
  { id:'ram2',       dataLat:'RAM',      label:'RAM',          style:{ width:'40px',  height:'200px', background:'#4caf50', top:'240px', left:'830px' } },
  { id:'ram3',       dataLat:'RAM',      label:'RAM',          style:{ width:'40px',  height:'200px', background:'#4caf50', top:'240px', left:'880px' } },
  { id:'ram4',       dataLat:'RAM',      label:'RAM',          style:{ width:'40px',  height:'200px', background:'#4caf50', top:'240px', left:'930px' } },
  { id:'ssd',        dataLat:'SSD',      label:'SSD',          style:{ width:'100px', height:'60px',  background:'#ff9800', top:'480px', left:'800px' } },
  { id:'hdd',        dataLat:'HDD',      label:'HDD',          style:{ width:'120px', height:'50px',  background:'#795548', top:'550px', left:'780px' } },
  { id:'net-nyc',    dataLat:'Net_NYC',  label:'SF→NYC',       style:{ width:'100px', height:'30px',  background:'#009688', top:'580px', left:'20px' } },
  { id:'net-uk',     dataLat:'Net_UK',   label:'SF→UK',        style:{ width:'100px', height:'30px',  background:'#009688', top:'620px', left:'20px' } },
  { id:'net-aus',    dataLat:'Net_AUS',  label:'SF→AUS',       style:{ width:'120px', height:'30px',  background:'#009688', top:'660px', left:'20px' } },
  { id:'os',         dataLat:'OS',       label:'OS Reboot',    style:{ width:'120px', height:'30px',  background:'#e91e63', top:'580px', left:'1040px' } },
  { id:'scsi',       dataLat:'SCSI',     label:'SCSI Timeout', style:{ width:'120px', height:'30px',  background:'#ff5722', top:'620px', left:'1040px' } },
  { id:'hwv',        dataLat:'HW',       label:'HW Virt',      style:{ width:'120px', height:'30px',  background:'#cc7722', top:'660px', left:'1040px' } },
  { id:'phy',        dataLat:'PHYS',     label:'System Reboot',style:{ width:'140px', height:'30px',  background:'#212121', top:'700px', left:'1040px' } }
]

// Converts ms → ms/s/min/h string
function formatTime(ms: number): string {
  if (ms < 1_000) {
    return `${ms.toFixed(1)} ms`
  }
  const secs = ms / 1_000
  if (secs < 60) {
    return `${secs.toFixed(2)} s`
  }
  const mins = secs / 60
  if (mins < 60) {
    return `${mins.toFixed(2)} min`
  }
  const hrs = mins / 60
  if (hrs < 24) {
    return `${hrs.toFixed(2)} hours`
  }
  const days = hrs / 24
  if (days < 365) {
    return `${days.toFixed(2)} days`
  }
  const years = days / 365
  return `${years.toFixed(2)} years`
}

export const Board: React.FC<BoardProps> = ({ onNodeClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const key = el.dataset.lat!
    onNodeClick(key)

    const duration = durations[key]
    if (!duration) return

    const packet = document.createElement('div')
    packet.className = 'packet'
    document.body.appendChild(packet)

    const from = el.getBoundingClientRect()
    const startX = from.left + window.scrollX + from.width/2 - 6
    const startY = from.top  + window.scrollY + from.height/2 - 6
    packet.style.left = `${startX}px`
    packet.style.top  = `${startY}px`

    const cpuRect = document.getElementById('cpu-socket')!.getBoundingClientRect()
    const endX = cpuRect.left + window.scrollX + cpuRect.width/2
    const endY = cpuRect.top  + window.scrollY + cpuRect.height/2

    packet.animate(
      [
        { transform: 'translate(0,0)' },
        { transform: `translate(${endX - startX}px, ${endY - startY}px)` }
      ],
      { duration, easing: 'linear' }
    ).onfinish = () => packet.remove()
  }

  return (
    <div>
      <h1>Memory Latency on a Motherboard</h1>
      <div id="board">
        {nodes.map(node => (
          <Tippy
            key={node.id}
            content={
              <div style={{ fontSize: '13px', lineHeight: 1.3 }}>
                <strong>{node.label}</strong><br/>
                {descriptions[node.dataLat]}<br/>
                Animation: {formatTime(durations[node.dataLat])}
              </div>
            }
            delay={[200, 0]}
          >
            <div
              id={node.id}
              className="mem"
              data-lat={node.dataLat}
              style={node.style}
              onClick={handleClick}
            >
              <span className="label">{node.label}</span>
            </div>
          </Tippy>
        ))}
      </div>
    </div>
  )
}
