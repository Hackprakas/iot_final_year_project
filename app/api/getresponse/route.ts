import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRecords } from "../../../actions/route1";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function GET() {
  try {
    const records = await getRecords();
    if (!records || records.length === 0) {
      return new Response("No data available for analysis", { status: 200 });
    }

    const systemPrompt = `You are an IoT monitoring system assistant analyzing sensor data from an IoT device. 
The data contains temperature readings in degrees Celsius and voltage readings in volts.
Analyze the following time-series data and provide insights:
1. Identify any anomalies or outliers in temperature or voltage
2. Detect patterns or trends over time
3. Provide alerts if values exceed normal ranges (temperature: 10-40°C, voltage: 3.0-6.0V)
4. Suggest possible actions if issues are detected
5. Summarize the overall system health

Based on the data, provide a concise monitoring report that would be useful for a technician. Just provide only text, not tables, no side headings or headings, just plain text in a detailed manner.

DATA:
`;

    const formattedData = records
      .map(
        (record) =>
          `Time: ${record.date}, Temperature: ${record.temp}°C, Voltage: ${record.volt}V`
      )
      .join("\n");

    const fullPrompt = systemPrompt + formattedData;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Streaming response
    const result = await model.generateContentStream(fullPrompt);
    const stream = result.stream;
    const encoder = new TextEncoder();
    const streamResponse = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk.text()));
        }
        controller.close();
      },
    });

    return new Response(streamResponse, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Error generating response", { status: 500 });
  }
}
