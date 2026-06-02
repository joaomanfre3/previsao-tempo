"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudSun, Loader2, TriangleAlert } from "lucide-react";
import { type Forecast, type GeoCity } from "@/lib/clima";
import { getForecast } from "./actions";
import { SearchBar } from "@/components/SearchBar";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";

const STORAGE_KEY = "previsao-tempo:v1";

// Cidade inicial quando não há nada salvo.
const DEFAULT_CITY: GeoCity = {
  id: 3448439,
  name: "São Paulo",
  country: "Brasil",
  admin1: "São Paulo",
  latitude: -23.5505,
  longitude: -46.6333,
};

export default function Home() {
  const [city, setCity] = useState<GeoCity | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Busca a previsão de uma cidade e atualiza a tela.
  const loadForecast = useCallback(async (target: GeoCity) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getForecast(target.latitude, target.longitude);
      setForecast(data);
    } catch {
      setError("Não foi possível carregar a previsão. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega a última cidade salva (ou a padrão) e busca a previsão.
  useEffect(() => {
    let saved = DEFAULT_CITY;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* localStorage indisponível — usa a padrão */
    }
    setCity(saved);
    setHydrated(true);
    void loadForecast(saved);
  }, [loadForecast]);

  function selectCity(next: GeoCity) {
    setCity(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignora */
    }
    void loadForecast(next);
  }

  if (!hydrated) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 py-8">
      <header className="flex items-center gap-2 px-1">
        <CloudSun size={26} style={{ color: "var(--color-accent)" }} />
        <h1 className="text-xl font-extrabold tracking-tight">Previsão do Tempo</h1>
      </header>

      <SearchBar onSelect={selectCity} />

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <TriangleAlert size={16} /> {error}
        </div>
      )}

      {/* Carregando */}
      {loading && !forecast && (
        <div className="flex flex-col items-center gap-2 py-16 text-ink/40">
          <Loader2 size={28} className="animate-spin" />
          <p className="text-sm">Carregando o clima...</p>
        </div>
      )}

      {/* Resultado */}
      {city && forecast && (
        <>
          <CurrentWeather city={city} current={forecast.current} />
          <div>
            <h2 className="mb-2 px-1 text-sm font-semibold uppercase tracking-wider text-ink/40">
              Próximos dias
            </h2>
            <DailyForecast daily={forecast.daily} todayKey={forecast.daily[0]?.date ?? ""} />
          </div>
        </>
      )}

      <footer className="mt-auto pt-4 text-center text-xs text-ink/30">
        Dados meteorológicos por Open-Meteo · atualizados ao vivo
      </footer>
    </main>
  );
}
