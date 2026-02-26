import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler);

function computeYBounds(rounds) {
  const vals = [];
  for (const r of rounds) {
    if (Number.isFinite(r.userOffer)) vals.push(r.userOffer);
    if (Number.isFinite(r.botOffer)) vals.push(r.botOffer);
  }
  if (vals.length === 0) return { min: 0, max: 10 };

  let min = Math.min(...vals);
  let max = Math.max(...vals);

  // Add padding so lines aren’t on the chart edges
  const range = Math.max(1, max - min);
  const pad = range * 0.12;

  return {
    min: min - pad,
    max: max + pad,
  };
}

export default function OfferChart({ rounds }) {
  if (!rounds || rounds.length === 0) return null;

  const labels = rounds.map((r) => `Round ${r.round}`);

  const userOffers = rounds.map((r) => r.userOffer);
  const botOffers = rounds.map((r) => r.botOffer);

  const { min, max } = computeYBounds(rounds);

  const data = {
    labels,
    datasets: [
      {
        label: "Your offers",
        data: userOffers,
        borderColor: "rgb(37, 99, 235)",        // blue
        backgroundColor: "rgba(37, 99, 235, 0.10)",
        pointBackgroundColor: "rgb(37, 99, 235)",
        pointBorderColor: "rgb(37, 99, 235)",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.25,
        fill: true,
      },
      {
        label: "Bot offers",
        data: botOffers,
        borderColor: "rgb(220, 38, 38)",        // red
        backgroundColor: "rgba(220, 38, 38, 0.08)",
        pointBackgroundColor: "rgb(220, 38, 38)",
        pointBorderColor: "rgb(220, 38, 38)",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.25,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // lets us control height via container
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: { boxWidth: 14, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Negotiation round" },
        ticks: { maxRotation: 0, autoSkip: true },
      },
      y: {
        title: { display: true, text: "Offer value" },
        suggestedMin: min,
        suggestedMax: max,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div style={{ height: 320 }}>
      <Line data={data} options={options} />
    </div>
  );
}