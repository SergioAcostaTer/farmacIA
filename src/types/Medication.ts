export interface Medication {
  id: number;
  num_registro: string;
  medicamento: string;
  laboratorio: string;
  fecha_aut: string;
  estado: string;
  fecha_estado: string;
  cod_atc: string;
  principios_activos: string;
  num_p_activos: number;
  comercializado: string;
  triangulo_amarillo: string;
  observaciones: string;
  sustituible: string;
  afecta_conduccion: string;
  problemas_suministro: string;
}
