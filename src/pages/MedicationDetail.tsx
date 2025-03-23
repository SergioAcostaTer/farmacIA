import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

function MedicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicationHtml = async () => {
      try {
        setLoading(true);
        const html = await invoke("get_medication_html_by_id", { id });
        setHtmlContent(html as string);
      } catch (err: any) {
        console.error("Error fetching medication HTML:", err);
        setError(err.message || "No se pudo cargar el HTML del medicamento.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationHtml();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error || !htmlContent) return (
    <div>
      <p>{error || "Medicamento no encontrado."}</p>
      <button onClick={() => navigate("/home")}>Volver al inicio</button>
    </div>
  );

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 md:p-8 min-w-[450px]">
      <button onClick={() => navigate("/home")} className="mb-6 px-4 py-2 bg-[var(--bg-secondary)] rounded-md">
        ← Volver
      </button>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export { MedicationDetail };