import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      "https://apis.codante.io/olympic-games/disciplines",
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
