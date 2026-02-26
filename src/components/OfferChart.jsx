import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

export default function OfferChart({ rounds }) {
  const labels = rounds.map(r => `R${r.round}`);
  const userOffers = rounds.map(r => r.userOffer);
  const botOffers = rounds.map(r => r.botOffer);

  const data = {
    labels,
    datasets: [
      { label: "Your offers", data: userOffers },
      { label: "Bot offers", data: botOffers },
    ],
  };

  return <Line data={data} />;
}