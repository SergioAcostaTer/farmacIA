import { useState, useEffect, useRef } from "react";
import { getGreeting } from "../utils/getGreeting";
import { SearchIcon, X } from "lucide-react";
// import { Category } from "../components/home/Category";
import { invoke } from "@tauri-apps/api/core";
import { Medication } from "../types/Medication.ts";
import { useNavigate, useSearchParams } from "react-router-dom";

// const PHARMACIES = [
//   "Antibióticos",
//   "Antineoplásicos",
//   "Antivirales",
//   "Fármacos cardiovasculares",
//   "Psicofármacos",
//   "Antiinflamatorios y analgésicos",
// ];

function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check URL param on component mount to open modal
  useEffect(() => {
    const overlayParam = searchParams.get("overlay");
    if (overlayParam === "open") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setIsModalOpen(false);
      setSearchParams({}); // Clear URL params when search is empty
      return;
    }

    try {
      setIsModalOpen(true);
      setSearchParams({ overlay: "open" }); // Update URL param when opening modal
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
    setSearchParams({}); // Clear URL param when closing modal
  };

  useEffect(() => {
    if (isModalOpen && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] relative flex flex-col gap-6 p-4 md:p-8 min-w-[450px]">
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
            className="w-full px-4 py-2 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-[var(--text-muted)]"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-200"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl p-6 relative bg-[var(--bg-primary)] rounded-lg shadow-xl transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={closeModal}
                className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-full transition-colors cursor-pointer z-10"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Search Input inside Modal */}
            <div className="relative mb-6">
              <input
                ref={modalInputRef}
                type="text"
                placeholder="Buscar fármaco (Presiona ESC para cerrar)"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-[var(--text-muted)]"
              />
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-semibold mb-4">
                  Resultados de búsqueda
                </h2>
                <ul className="space-y-3">
                  {searchResults.map((med: any) => (
                    <li
                      key={med?.id}
                      className="p-4 bg-[var(--bg-secondary)] rounded-md hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                      onClick={() => navigate(`/med/${med?.num_registro}`)}
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
            ) : (
              <p className="text-center text-[var(--text-muted)]">
                No se encontraron resultados
              </p>
            )}
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {PHARMACIES.map((categoria) => (
          <Category key={categoria} name={categoria} />
        ))}
      </div> */}
    </div>
  );
}

export { Home };
