import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';

const prisma = new PrismaClient();

// --- Firebase Admin Initialization ---
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
  // 1. Protect the endpoint with a secret
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 2. The Pump Control Logic for History Logging
  const MOISTURE_THRESHOLD = 20;
  const PUMP_IDENTIFIER = 'main_pump_1';

  try {
    const snapshot = await db.ref('/soil_moisture').once('value');
    const soilMoisture = snapshot.val();

    if (soilMoisture === null) {
      return NextResponse.json({ message: 'Soil moisture data not available.' });
    }

    // Get the most recent status record for this pump
    const lastStatus = await prisma.PumpStatus.findFirst({
      where: { pumpId: PUMP_IDENTIFIER },
      orderBy: { createdAt: 'desc' },
    });

    const currentIsActive = lastStatus ? lastStatus.isActive : false;
    let statusChanged = false;
    let newStatus = currentIsActive;

    // Logic to turn the pump ON
    if (soilMoisture < MOISTURE_THRESHOLD && !currentIsActive) {
      statusChanged = true;
      newStatus = true;
    }
    // Logic to turn the pump OFF
    else if (soilMoisture >= MOISTURE_THRESHOLD && currentIsActive) {
      statusChanged = true;
      newStatus = false;
    }

    // If the status changed, create a new record in the database
    if (statusChanged) {
      await prisma.PumpStatus.create({
        data: {
          pumpId: PUMP_IDENTIFIER,
          isActive: newStatus,
        },
      });
    }

    return NextResponse.json({
      success: true,
      statusChanged,
      soilMoisture,
      pumpStatus: newStatus,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}