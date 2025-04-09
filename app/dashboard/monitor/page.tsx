'use client';

import { useEffect, useState } from 'react';

import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import Image from 'next/image';
import machine2 from '../../../public/machine.jpg'
import mqtt from 'mqtt';

import { toast } from "sonner"

import type { MqttClient } from 'mqtt';
import { createRecord } from '@/actions/route1';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const machine = {
    name: 'Machine 1',
    image: '/machine1.jpg',
    status: 'running', // 'running' or 'halted'
    avgVoltage: 220,
    runHours: 1200,
    heat: 75,
    halts: 5,
    powerConsumption: 20,
    efficiency: 85,
    loadCapacity: 80,
    lastMaintenance: '15 days ago'
};

const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Voltage (V)',
            data: [8, 8.2, 8.8, 9, 8.7, 8.5],
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


    const [client, setClient] = useState<MqttClient | null>(null);
    const [machineStatus, setMachineStatus] = useState("stopped"); // Example state
    const [temperature, setTemperature] = useState(0);
    const [voltage, setVoltage] = useState(0)
    const [response, setresponse] = useState("")
    const [loading, setloading] = useState(true)
    const MQTT_BROKER = "ws://192.168.82.70:9001"; // Replace with your broker's IP
    const MQTT_TOPIC = "iot/motor/live";

    useEffect(() => {
        const mqttClient = mqtt.connect(MQTT_BROKER, {
            protocol: "ws", // Ensure WebSocket is used
            reconnectPeriod: 1000,
        });

        mqttClient.on("connect", () => console.log("✅ Connected to MQTT via WebSockets"));
        mqttClient.on("error", (err) => console.error("❌ MQTT Connection Error:", err));
        mqttClient.on("close", () => console.log("🔌 MQTT Disconnected"));



        setClient(mqttClient);


        return () => {
            mqttClient.end();
        };
    }, []);


    useEffect(() => {
        setloading(true);

        async function handleGemini() {
            try {
                const res = await fetch("/api/getresponse", { method: "GET" });
                const reader = res.body?.getReader();
                if (!reader) {
                    throw new Error("Failed to get reader from response body");
                }
                const decoder = new TextDecoder();

                let newResponse = ""; // Start with an empty response

                setresponse(""); // Clear previous response to prevent appending

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    newResponse += decoder.decode(value);
                    setresponse(newResponse); // Update UI dynamically with the latest content
                }
            }
            catch (e) {
                console.log("Error in generating response: ", e);
            }
        }

        handleGemini();
        setloading(false);

        const interval = setInterval(() => {
            handleGemini();
        }, 60000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);



    useEffect(() => {

        if (client) {
            client.subscribe("iot/motor/warning");
            client.on("message", (topic, message) => {
                if (topic === "iot/motor/warning") {

                    const messageString = message.toString();
                    // console.log(`📡 Received message: ${message.toString()}`);
                    console.log(`📡 Received message: ${messageString}`);
                    toast.warning(messageString)
                }

            });
        }
    }, [client]);

    useEffect(() => {
        if (client) {
            client.subscribe(MQTT_TOPIC);
            client.subscribe("iot/motor/db")
            client.on("message", (topic, message) => {
                if (topic === MQTT_TOPIC) {

                    const messageString = message.toString();
                    const messageObject = JSON.parse(messageString);
                    console.log(`📡 Received message: ${messageString}`);
                    setTemperature(messageObject.temperature);
                    setVoltage(messageObject.voltage);

                    if (messageObject.motorState == 0) {
                        setMachineStatus("Stopped");

                    } else {
                        setMachineStatus("running");

                    }
                }
                else if (topic === "iot/motor/db") {
                    const messageString = message.toString();
                    const messageObject = JSON.parse(messageString);
                    const temperatures = messageObject.temperature;
                    const voltages = messageObject.voltage;
                    console.log("db data" + temperatures.toString() + " " + voltages.toString());
                    async function uploaddata() {
                        const res = await createRecord({ temp: temperatures.toString(), volt: voltages, date: new Date() })
                    }
                    uploaddata();
                }
            });
        }
    }
        , [client]);








    const toggleMotor = () => {
        if (client) {
            const command = machineStatus === "running" ? "1" : "2"; // "1" = OFF, "2" = ON
            client.publish("iot/motor/control", command);
            console.log(`📡 Sent command: ${command}`);
            setMachineStatus(machineStatus === "running" ? "stopped" : "running");
        }
    };

    return (
        <div className='flex w-full flex-wrap lg:flex-nowrap'>
            <div className="p-6 ml-8 flex flex-col w-full  items-center ">
                <div className="flex items-center w-full bg-white p-4 rounded-lg shadow-xl">
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
                                onClick={toggleMotor}
                                className={`mt-2 px-4 py-2 rounded-md text-white ${machineStatus === 'running' ? 'bg-red-500' : 'bg-green-500'}`}
                            >
                                {machineStatus === 'running' ? 'Turn Off' : 'Turn On'}
                            </button>
                        </div>
                    </div>
                </div>



                <div className='flex w-full justify-center'>


                    <div>
                        <div className="mt-6 w-full  grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                                <h3 className="text-lg font-medium mb-2">Current Temperature & Voltage</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center text-blue-500 text-xl font-bold">
                                        🔥 {temperature}°C
                                    </div>
                                    <div className="flex items-center text-yellow-500 text-xl font-bold">
                                        ⚡ {voltage}V
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-medium mb-2">Machine Statistics</h3>
                                <Bar data={barData} />
                            </div>
                        </div>

                        <div className="mt-6 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className=''>
                        <div className="p-6 w-full h-[620px]  flex justify-center">
                            <div className="bg-white h-[620px] overflow-y-scroll p-4 rounded-lg shadow-md flex flex-col items-center w-[400px]">
                                <div className='flex flex-row-reverse items-center'>
                                    <h3 className="text-lg font-medium mb-2 mr-4">AI-Driven Analytics</h3>
                                    <div className="w-10 h-10 mr-2 animate-spin">
                                        <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">{loading ? "loading response..." : response} </p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>



        </div>


    );
};

export default MachineStats;
