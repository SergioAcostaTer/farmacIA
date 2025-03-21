import { getGreeting } from "../utils/getGreeting";
import { SearchIcon } from "lucide-react";
import { Category } from "../components/home/Category";

const PHARMACIES = [
  "Antibióticos",
  "Antineoplásicos",
  "Antivirales",
  "Fármacos cardiovasculares",
  "Psicofármacos",
  "Antiinflamatorios y analgésicos",
];

function Home() {
  return (
    <div className="space-y-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{getGreeting()}</h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Bienvenido a FarmacIA
        </p>
      </div>

      {/* Search Section */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar fármaco"
            className="w-full px-4 py-2 border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />

          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PHARMACIES.map((categoria) => (
          <Category key={categoria} name={categoria} />
        ))}
      </div>
    </div>
  );
}

export { Home };
