import { createDirigeraClient } from 'dirigera'

const url = process.env.TELEMETRY_URL;

async function getData() {
  const client = await createDirigeraClient({
    accessToken: process.env.DIRIGERA_TOKEN,
  })

  const devices = await client.devices.list()

  const airSensor = devices.find(device => device.deviceType == 'environmentSensor');

  return {
    temperature: airSensor.attributes.currentTemperature,
    pm25: airSensor.attributes.currentPM25,
    voc: airSensor.attributes.vocIndex,
    humidity: airSensor.attributes.currentRH,
  }
}


async function sendTelemetry(data) {
  console.log('Sending telemetry data:', data);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(response.status);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the async function to send the telemetry data
// sendTelemetry();

const sensorData = await getData();
console.log(sensorData);

sendTelemetry(sensorData);