'use client';

import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Energy Saved Card */}
            <div className="bg-white shadow-lg rounded-xl p-4">
                <h2 className="text-lg font-semibold">Energy Saved</h2>
                <Line data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Energy Saved (kWh)',
                        data: [120, 150, 200, 180, 220],
                        borderColor: 'green',
                        backgroundColor: 'rgba(0,255,0,0.2)'
                    }]
                }} />
            </div>

            {/* Average Voltage Card */}
            <div className="bg-white shadow-lg rounded-xl p-4">
                <h2 className="text-lg font-semibold">Average Voltage Drawn</h2>
                <Bar data={{
                    labels: ['Device 1', 'Device 2', 'Device 3'],
                    datasets: [{
                        label: 'Voltage (V)',
                        data: [220, 230, 210],
                        backgroundColor: 'blue'
                    }]
                }} />
            </div>

            {/* Power Consumption Card */}
            <div className="bg-white shadow-lg rounded-xl p-4">
                <h2 className="text-lg font-semibold">Average Power (W)</h2>
                <Doughnut data={{
                    labels: ['Used', 'Remaining'],
                    datasets: [{
                        data: [70, 30],
                        backgroundColor: ['red', 'gray']
                    }]
                }} />
            </div>

            {/* Devices Running vs Halted */}
            <div className="bg-white shadow-lg rounded-xl p-4">
                <h2 className="text-lg font-semibold">Devices Running vs Halted</h2>
                <Doughnut data={{
                    labels: ['Running', 'Halted'],
                    datasets: [{
                        data: [15, 5],
                        backgroundColor: ['green', 'orange']
                    }]
                }} />
            </div>

            {/* Failures Prevented Card */}
            <div className="bg-white shadow-lg rounded-xl p-4">
                <h2 className="text-lg font-semibold">Failures Prevented</h2>
                <Bar data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [{
                        label: 'Failures Prevented',
                        data: [5, 10, 15, 7, 20],
                        backgroundColor: 'purple'
                    }]
                }} />
            </div>
        </div>
    );
};

export default Dashboard;
