import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'City is required' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
  );
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
