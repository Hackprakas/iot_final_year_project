import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRecords } from "./route1";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyDNNkT4OBfrHcvi9GY9Me3lAXEMkA7_nyg"
);

export async function generateResponse() {
  console.log("Api key: " + process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const records = await getRecords();
    if (records && records.length > 0) {
      // System prompt that provides context and instructions
      const systemPrompt = `You are an IoT monitoring system assistant analyzing sensor data from an IoT device. 
The data contains temperature readings in degrees Celsius and voltage readings in volts.
Analyze the following time-series data and provide insights:
1. Identify any anomalies or outliers in temperature or voltage
2. Detect patterns or trends over time
3. Provide alerts if values exceed normal ranges (temperature: 10-40°C, voltage: 3.0-6.0V)
4. Suggest possible actions if issues are detected
5. Summarize the overall system health

Based on the data, provide a concise monitoring report that would be useful for a technician.

DATA:
`;

      const formattedData = records
        .map(
          (record: any) =>
            `Time: ${record.date}, Temperature: ${record.temp}°C, Voltage: ${record.volt}V`
        )
        .join("\n");

      const fullPrompt = systemPrompt + formattedData;
      const result = await model.generateContent(fullPrompt);
      // console.log(result.response.text());
      return result.response.text();
    } else {
      console.log("No records found or empty records returned");
      return "No data available for analysis";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
