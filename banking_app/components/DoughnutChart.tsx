"use client"
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

const DoughnutChart = ({accounts}: DoughnutChartProps) => {
    const data = {
        datasets :[
            {
             label: 'Banks',
             data: [1489,4968, 3290],
             backgroundColor:['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6'],

            }
        ],
        labels:['Bank1','Bank2','Bank3']
    }
  return (
   <Doughnut
   options={{
    cutout: '70%',
    responsive:true,
    plugins:{
        legend:{
            display:false}}
   }}
    data={data} />
  )
}

export default DoughnutChart
