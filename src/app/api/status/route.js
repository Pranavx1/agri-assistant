import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Calculate the date and time for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 2. Query the database for pump statuses created since that time
    const pumpHistory = await prisma.pumpStatus.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo, // "gte" means "greater than or equal to"
        },
      },
      orderBy: {
        createdAt: 'desc', // Show the most recent events first
      },
    });

    return NextResponse.json(pumpHistory);

  } catch (error) {
    console.error("API Error fetching pump history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}