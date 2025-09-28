import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';

const prisma = new PrismaClient();

// --- Firebase Admin Initialization ---
// Make sure your service account JSON is available
// You'll need to set GOOGLE_APPLICATION_CREDENTIALS in Vercel's environment variables
try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error.message);
}

const db = admin.database();

// --- Main Cron Job Logic ---
export async function GET(request) {
  // 1. Protect the endpoint with a secret key
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. The Pump Control Logic (moved from your script)
  const MOISTURE_THRESHOLD = 20;
  const PUMP_ID = 'main_pump_1';

  try {
    const snapshot = await db.ref('/npk/soil_moisture').once('value');
    const soilMoisture = snapshot.val();

    if (soilMoisture === null) {
      return NextResponse.json({ message: 'Soil moisture data not available.' });
    }

    const pump = await prisma.pumpStatus.findUnique({ where: { id: PUMP_ID } });
    if (!pump) {
         // Create a default record if it doesn't exist
        await prisma.pumpStatus.create({ data: { id: PUMP_ID, isActive: false, waterDelivered: 0 } });
        return NextResponse.json({ message: 'Initial pump record created.' });
    }

    let updated = false;
    if (soilMoisture < MOISTURE_THRESHOLD && !pump.isActive) {
      await prisma.pumpStatus.update({ where: { id: PUMP_ID }, data: { isActive: true, lastUpdated: new Date() } });
      updated = true;
    } else if (soilMoisture >= MOISTURE_THRESHOLD && pump.isActive) {
      await prisma.pumpStatus.update({ where: { id: PUMP_ID }, data: { isActive: false, lastUpdated: new Date() } });
      updated = true;
    }
    
    return NextResponse.json({ success: true, updated, soilMoisture, pumpStatus: pump.isActive });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}