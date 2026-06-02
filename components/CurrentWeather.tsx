"use client";

import { motion } from "framer-motion";
import { Droplets, Thermometer, Wind } from "lucide-react";
import {
  type CurrentWeather as Current,
  type GeoCity,
  cityFullName,
  describeWeather,
  formatTemp,
} from "@/lib/clima";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  city: GeoCity;
  current: Current;
}

export function CurrentWeather({ city, current }: CurrentWeatherProps) {
  const info = describeWeather(current.code, current.isDay);

  return (
    <motion.section
      key={`${city.latitude},${city.longitude}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl p-6 text-white shadow-lg"
      style={{
        background: current.isDay
          ? "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)"
          : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      }}
    >
      <p className="text-sm font-medium text-white/80">{cityFullName(city)}</p>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="tnum text-6xl font-extrabold leading-none">
            {formatTemp(current.temp)}
          </p>
          <p className="mt-1 text-white/90">{info.label}</p>
        </div>
        <WeatherIcon name={info.icon} size={84} className="text-white drop-shadow" />
      </div>

      {/* Métricas */}
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <Metric icon={<Thermometer size={16} />} label="Sensação" value={formatTemp(current.feelsLike)} />
        <Metric icon={<Droplets size={16} />} label="Umidade" value={`${current.humidity}%`} />
        <Metric icon={<Wind size={16} />} label="Vento" value={`${Math.round(current.wind)} km/h`} />
      </div>
    </motion.section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/15 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1 text-xs text-white/80">
        {icon} {label}
      </div>
      <p className="tnum mt-1 font-bold">{value}</p>
    </div>
  );
}
