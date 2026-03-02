import { NextResponse } from "next/server";
import { INITIAL_MATCH } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(INITIAL_MATCH);
}
