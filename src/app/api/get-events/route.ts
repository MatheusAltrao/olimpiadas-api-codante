import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;
  const gender = searchParams.get("gender") || ""; // Captura o parâmetro de gênero

  try {
    const response = await axios.get(
      `https://apis.codante.io/olympic-games/events`,
      {
        params: {
          page: page,
          gender: gender, // Inclui o filtro de gênero na requisição
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
