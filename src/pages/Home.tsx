import { useState } from "react";
import { getGreeting } from "../utils/getGreeting";
import { SearchIcon, X } from "lucide-react";
import { Category } from "../components/home/Category";
import { invoke } from "@tauri-apps/api/core";
import { Medication } from "../types/Medication.ts";


const PHARMACIES = [
  "Antibióticos",
  "Antineoplásicos",
  "Antivirales",
  "Fármacos cardiovasculares",
  "Psicofármacos",
  "Antiinflamatorios y analgésicos",
];

function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setIsModalOpen(false);
      return;
    }

    try {
      setIsModalOpen(true);
      const results = await invoke("search_medications", { query });
      setSearchResults(results as Medication[]);
    } catch (error) {
      console.error("Error searching medications:", error);
      setSearchResults([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-8 bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{getGreeting()}</h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Bienvenido a FarmacIA
        </p>
      </div>

      {/* Search Trigger */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar fármaco"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl p-6 relative bg-[var(--bg-primary)] rounded-md shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 p-1 hover:bg-[var(--bg-secondary)] rounded-full z-10"
            >
              <X className="h-5 w-5 text-[var(--text-muted)]" />
            </button>

            {/* Search Input inside Modal */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Buscar fármaco"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-h-[60vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Resultados de búsqueda</h2>
                <ul className="space-y-3">
                  {searchResults.map((med: any) => (
                    <li
                      key={med?.id}
                      className="p-3 bg-[var(--bg-secondary)] rounded-md"
                    >
                      <p>
                        <strong>{med?.medicamento}</strong> - {med?.laboratorio}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Estado: {med?.estado} | Cod. ATC: {med?.cod_atc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

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