import { NextResponse } from "next/server";
import { PARKS } from "@/lib/parks";

export async function GET() {
  return NextResponse.json(PARKS);
}
