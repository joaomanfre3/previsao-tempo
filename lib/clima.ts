// Tipos do clima e tradução dos códigos WMO pra português — lógica pura.

export interface GeoCity {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  isDay: boolean;
  code: number;
}

export interface DailyWeather {
  date: string; // "AAAA-MM-DD"
  code: number;
  max: number;
  min: number;
  rainProb: number;
}

export interface Forecast {
  current: CurrentWeather;
  daily: DailyWeather[];
}

export interface WeatherInfo {
  label: string;
  /** Nome do ícone Lucide (resolvido na UI). */
  icon: string;
}

/**
 * Traduz um código WMO (e o período do dia) pra rótulo em PT + ícone.
 * Tabela oficial: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 */
export function describeWeather(code: number, isDay = true): WeatherInfo {
  const clear = isDay ? "sun" : "moon";
  const fewClouds = isDay ? "cloud-sun" : "cloud-moon";

  const table: Record<number, WeatherInfo> = {
    0: { label: "Céu limpo", icon: clear },
    1: { label: "Quase limpo", icon: fewClouds },
    2: { label: "Parcialmente nublado", icon: fewClouds },
    3: { label: "Nublado", icon: "cloud" },
    45: { label: "Névoa", icon: "fog" },
    48: { label: "Névoa com geada", icon: "fog" },
    51: { label: "Garoa fraca", icon: "drizzle" },
    53: { label: "Garoa", icon: "drizzle" },
    55: { label: "Garoa forte", icon: "drizzle" },
    56: { label: "Garoa congelante", icon: "drizzle" },
    57: { label: "Garoa congelante forte", icon: "drizzle" },
    61: { label: "Chuva fraca", icon: "rain" },
    63: { label: "Chuva", icon: "rain" },
    65: { label: "Chuva forte", icon: "rain" },
    66: { label: "Chuva congelante", icon: "rain" },
    67: { label: "Chuva congelante forte", icon: "rain" },
    71: { label: "Neve fraca", icon: "snow" },
    73: { label: "Neve", icon: "snow" },
    75: { label: "Neve forte", icon: "snow" },
    77: { label: "Grãos de neve", icon: "snow" },
    80: { label: "Pancadas de chuva", icon: "showers" },
    81: { label: "Pancadas de chuva", icon: "showers" },
    82: { label: "Pancadas fortes", icon: "showers" },
    85: { label: "Pancadas de neve", icon: "snow" },
    86: { label: "Pancadas de neve fortes", icon: "snow" },
    95: { label: "Trovoada", icon: "thunder" },
    96: { label: "Trovoada com granizo", icon: "thunder" },
    99: { label: "Trovoada com granizo", icon: "thunder" },
  };

  return table[code] ?? { label: "—", icon: "cloud" };
}

/** Arredonda e formata a temperatura, ex.: 12.9 -> "13°". */
export function formatTemp(value: number): string {
  return `${Math.round(value)}°`;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Rótulo do dia da semana a partir de "AAAA-MM-DD" (hoje vira "Hoje"). */
export function weekdayLabel(dateKey: string, todayKey: string): string {
  if (dateKey === todayKey) return "Hoje";
  const [y, m, d] = dateKey.split("-").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

/** Junta nome, estado e país numa linha só, sem campos vazios. */
export function cityFullName(city: GeoCity): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}
