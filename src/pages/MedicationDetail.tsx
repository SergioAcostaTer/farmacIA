import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { Medication } from "../types/Medication";

function MedicationDetail() {
  const { id } = useParams<{ id: string }>(); // Explicitly type id as string
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [details, setDetails] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicationData = async () => {
      try {
        setLoading(true);
        const [html, medicationDetails] = await Promise.all([
          invoke<string>("get_medication_html_by_id", { id }),
          invoke<Medication>("get_medication_by_num_registro", { numRegistro: id }),
        ]);
        setHtmlContent(html);
        setDetails(medicationDetails);
      } catch (err: any) {
        console.error("Error al obtener datos del medicamento:", err);
        setError(err.message || "No se pudieron cargar los datos del medicamento.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicationData();
    } else {
      setError("ID del medicamento no proporcionado.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <p className="text-[var(--text-primary)] text-lg">Cargando...</p>
      </div>
    );
  }

  if (error || !details || !htmlContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            Error
          </h2>
          <p className="text-[var(--text-muted)] mb-6">
            {error || "Medicamento no encontrado."}
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-primary-hover)] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 min-w-[450px] min-h-screen">

      {/* Medication Title and Basic Info */}
      <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          {details.medicamento}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Número de registro:</span>{" "}
              {details.num_registro}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Laboratorio:</span>{" "}
              {details.laboratorio}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Estado:</span> {details.estado}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Fecha de autorización:</span>{" "}
              {details.fecha_aut}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Principios activos:</span>{" "}
              {details.principios_activos}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Código ATC:</span> {details.cod_atc}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Comercializado:</span>{" "}
              {details.comercializado === "Sí" ? "Sí" : "No"}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              <span className="font-semibold">Afecta a la conducción:</span>{" "}
              {details.afecta_conduccion === "Sí" ? "Sí" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed HTML Content */}
      <div
        className="prose prose-sm md:prose-base max-w-none text-[var(--text-primary)]"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export { MedicationDetail };