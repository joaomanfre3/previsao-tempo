"use server";

import type { Forecast, GeoCity } from "@/lib/clima";

/**
 * Busca cidades pelo nome (geocoding da Open-Meteo, gratuito e sem token).
 * Roda no servidor — o navegador não fala direto com a API.
 */
export async function searchCity(query: string): Promise<GeoCity[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    q,
  )}&count=6&language=pt&format=json`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const data: { results?: RawGeo[] } = await res.json();
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country ?? "",
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

/** Busca o clima atual + 7 dias de uma coordenada (Open-Meteo). */
export async function getForecast(lat: number, lon: number): Promise<Forecast> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=7`;

  // Clima muda ao longo do dia — não cacheia de forma agressiva.
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Não foi possível buscar a previsão agora.");

  const d: RawForecast = await res.json();

  return {
    current: {
      temp: d.current.temperature_2m,
      feelsLike: d.current.apparent_temperature,
      humidity: d.current.relative_humidity_2m,
      wind: d.current.wind_speed_10m,
      isDay: d.current.is_day === 1,
      code: d.current.weather_code,
    },
    daily: d.daily.time.map((date, i) => ({
      date,
      code: d.daily.weather_code[i],
      max: d.daily.temperature_2m_max[i],
      min: d.daily.temperature_2m_min[i],
      rainProb: d.daily.precipitation_probability_max[i] ?? 0,
    })),
  };
}

// ---- Formatos brutos da Open-Meteo (só pra tipar a resposta) ----

interface RawGeo {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface RawForecast {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    is_day: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
}
