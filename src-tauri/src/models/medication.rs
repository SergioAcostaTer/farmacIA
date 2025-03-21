use serde::Serialize;
use sqlx::FromRow;

#[derive(Serialize, Debug, FromRow)]
pub struct Medication {
    pub id: i32,
    pub num_registro: String,
    pub medicamento: String,
    pub laboratorio: String,
    pub fecha_aut: String,
    pub estado: String,
    pub fecha_estado: String,
    pub cod_atc: String,
    pub principios_activos: String,
    pub num_p_activos: i32,
    pub comercializado: String,
    pub triangulo_amarillo: String,
    pub observaciones: String,
    pub sustituible: String,
    pub afecta_conduccion: String,
    pub problemas_suministro: String,
}
