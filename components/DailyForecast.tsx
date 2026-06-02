"use client";

import { Droplets } from "lucide-react";
import {
  type DailyWeather,
  describeWeather,
  formatTemp,
  weekdayLabel,
} from "@/lib/clima";
import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastProps {
  daily: DailyWeather[];
  todayKey: string;
}

export function DailyForecast({ daily, todayKey }: DailyForecastProps) {
  return (
    <section className="rounded-3xl bg-white/70 p-2 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <ul className="divide-y divide-black/5">
        {daily.map((day) => {
          const info = describeWeather(day.code, true);
          return (
            <li key={day.date} className="flex items-center gap-3 px-3 py-3">
              {/* Dia */}
              <span className="w-12 shrink-0 font-semibold">
                {weekdayLabel(day.date, todayKey)}
              </span>

              {/* Ícone + chance de chuva */}
              <div className="flex w-20 items-center gap-1.5 text-ink/70">
                <WeatherIcon name={info.icon} size={22} />
                {day.rainProb > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-sky-600">
                    <Droplets size={11} /> {day.rainProb}%
                  </span>
                )}
              </div>

              {/* Descrição (some no mobile pequeno) */}
              <span className="hidden flex-1 truncate text-sm text-ink/50 sm:block">
                {info.label}
              </span>

              {/* Máx / mín */}
              <span className="tnum ml-auto shrink-0 font-semibold">
                {formatTemp(day.max)}
                <span className="ml-2 text-ink/40">{formatTemp(day.min)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
