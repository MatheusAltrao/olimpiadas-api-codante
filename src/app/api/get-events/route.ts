import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;
  const country = searchParams.get("country") || "";
  const discipline = searchParams.get("discipline") || "";

  try {
    const response = await axios.get(
      `https://apis.codante.io/olympic-games/events`,
      {
        params: {
          page: page,
          country: country,
          discipline: discipline,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
