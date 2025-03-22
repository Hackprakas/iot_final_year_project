'use client';

import { useState } from 'react';
import { Circle } from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import Image from 'next/image';
import machine2 from '../../../../public/machine.jpg'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const machine = {
    name: 'Machine 1',
    image: '/machine1.jpg',
    status: 'running', // 'running' or 'halted'
    avgVoltage: 220,
    runHours: 1200,
    heat: 75,
    halts: 5,
    powerConsumption: 500,
    efficiency: 85,
    loadCapacity: 80,
    lastMaintenance: '15 days ago'
};

const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Voltage (V)',
            data: [210, 215, 220, 225, 230, 220],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        },
    ],
};

const doughnutData = {
    labels: ['Efficiency', 'Loss'],
    datasets: [
        {
            data: [machine.efficiency, 100 - machine.efficiency],
            backgroundColor: ['#36A2EB', '#FF6384'],
        },
    ],
};

const barData = {
    labels: ['Power Consumption', 'Heat', 'Halts', 'Load Capacity'],
    datasets: [
        {
            label: 'Machine Stats',
            data: [machine.powerConsumption, machine.heat, machine.halts, machine.loadCapacity],
            backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#2196F3'],
        },
    ],
};

const MachineStats = () => {
    const [machineStatus, setMachineStatus] = useState(machine.status);

    const toggleMachineStatus = () => {
        setMachineStatus(machineStatus === 'running' ? 'halted' : 'running');
    };

    return (
        <div className='flex w-full'>


            <div className="p-6 ml-8 flex flex-col  w-full items-center mr-10 ">
                <div className="flex  items-center  w-full bg-white p-4 rounded-lg shadow-xl">
                    <Image src={machine2} alt={machine.name} width={64} height={64} className="w-16 h-16 rounded-full mr-4" />
                    <div className='flex justify-between w-full'>
                        <div>

                            <h2 className="text-xl font-semibold">{machine.name}</h2>
                            <p className="flex items-center text-sm">
                                Status: {machineStatus === 'running' ? (
                                    <span className="text-green-500 flex items-center ml-2"> Running</span>
                                ) : (
                                    <span className="text-red-500 flex items-center ml-2"> Halted</span>
                                )}
                            </p>
                        </div>
                        <div>

                            <button
                                onClick={toggleMachineStatus}
                                className={`mt-2 px-4 py-2 rounded-md text-white ${machineStatus === 'running' ? 'bg-red-500' : 'bg-green-500'}`}
                            >
                                {machineStatus === 'running' ? 'Turn Off' : 'Turn On'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 w-full max-w-3xl">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium mb-2">Machine Statistics</h3>
                        <Bar data={barData} />
                    </div>
                </div>

                <div className="mt-6 w-full max-w-3xl grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium mb-2">Voltage Trends</h3>
                        <Line data={lineData} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                        <h3 className="text-lg font-medium mb-2">Efficiency</h3>
                        <Doughnut data={doughnutData} />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MachineStats;
