"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { searchCity } from "@/app/actions";
import { type GeoCity, cityFullName } from "@/lib/clima";

interface SearchBarProps {
  onSelect: (city: GeoCity) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Busca com debounce de 350ms pra não disparar a cada tecla.
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const cities = await searchCity(query);
      setResults(cities);
      setOpen(true);
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Fecha a lista ao clicar fora.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function pick(city: GeoCity) {
    onSelect(city);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
        <Search size={18} className="text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar cidade..."
          className="w-full bg-transparent py-3.5 text-base outline-none placeholder:text-ink/40"
        />
        {loading && <Loader2 size={18} className="animate-spin text-ink/40" />}
      </div>

      {/* Resultados */}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
          {results.map((city) => (
            <li key={city.id}>
              <button
                onClick={() => pick(city)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-sky-50"
              >
                <MapPin size={16} className="shrink-0 text-ink/40" />
                <span className="truncate text-sm">{cityFullName(city)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
