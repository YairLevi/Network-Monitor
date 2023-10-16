import zoomPlugin from 'chartjs-plugin-zoom';
import './App.css'
import {Line} from "react-chartjs-2";


import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export const options = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.5,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      min: 0,
      max: 5,
      grid: {
        display: false
      },
      ticks: {
        color: "lightgray"
      }
    },
    x: {
      display: false,
      grid: {
        display: false
      },
    }
  },
};

function stringToHexColor(inputString: string): string {
  // Seed value for color generation
  let hash = 0;

  // Generate a hash code from the input string
  for (let i = 0; i < inputString.length; i++) {
    const charCode = inputString.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
  }

  // Ensure the hash is positive
  if (hash < 0) {
    hash = -hash;
  }

  // Generate a bright color using the hash as a seed
  const r = (hash % 128) + 128; // Red component
  const g = ((hash >> 8) % 128) + 128; // Green component
  const b = ((hash >> 16) % 128) + 128; // Blue component

  // Convert RGB to hexadecimal color code
  const hexColor = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;

  return hexColor;
}
export function Chart(props: { name: string, data: number[] }) {
  const lastPingMB = (props.data.at(-1) / 1000000).toFixed(2)
  const AvgPingMB = ((props.data.reduce((a,b) => a+b) / props.data.length) / 1000000).toFixed(2)

  return (
    <div style={{ display: "flex" }}>
      <Line
        style={{maxWidth: 600, maxHeight: 150}}
        options={options}
        data={{
          labels: [...[...new Array(41).keys()].map((val) => val)],
          datasets: [
            {
              label: props.name,
              data: props.data.map(val => val / 1000000),
              borderColor: stringToHexColor(props.name),
              backgroundColor: stringToHexColor(props.name),
            },
          ],
        }}
      />
      <div style={{width: 150, display:"flex", justifyContent:"center", height: 150, alignItems: "start", flexDirection: "column"}}>
        <span>User: {props.name}</span>
        <span>Last: {lastPingMB} MB</span>
        <span>Average: {AvgPingMB} MB</span>
      </div>
    </div>
  )
}
