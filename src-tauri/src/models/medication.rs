use serde::{Serialize, Deserialize};
use sqlx::FromRow;

// Existing Medication struct (unchanged)
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

// New struct for detailed view with API data
#[derive(Serialize, Debug)]
pub struct DetailedMedication {
    // Copy fields from Medication
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
    // Additional fields from API
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ficha_tecnica_html: Option<String>, // Raw HTML content
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ficha_tecnica_info: Option<Vec<SectionInfo>>, // Parsed sections
}

// Struct for parsed HTML sections
#[derive(Serialize, Deserialize, Debug)]
pub struct SectionInfo {
    pub section_number: String,
    pub title: String,
    pub content: String,
}

// Struct to deserialize CIMA API response
#[derive(Deserialize, Debug)]
struct CimaMedication {
    nregistro: String,
    nombre: String,
    pactivos: String,
    labtitular: String,
    labcomercializador: String,
    cpresc: String,
    estado: CimaEstado,
    comerc: bool,
    receta: bool,
    generico: bool,
    conduc: bool,
    triangulo: bool,
    huerfano: bool,
    biosimilar: bool,
    nosustituible: CimaItem,
    psum: bool,
    notas: bool,
    #[serde(rename = "materialesInf")]
    materiales_inf: bool,
    ema: bool,
    docs: Vec<CimaDocumento>,
    atcs: Vec<CimaATC>,
    #[serde(rename = "principiosActivos")]
    principios_activos: Vec<CimaPrincipioActivo>,
    #[serde(rename = "viasAdministracion")]
    vias_administracion: Vec<CimaItem>,
    presentaciones: Vec<CimaPresentacion>,
    #[serde(rename = "formaFarmaceutica")]
    forma_farmaceutica: CimaItem,
    #[serde(rename = "formaFarmaceuticaSimplificada")]
    forma_farmaceutica_simplificada: CimaItem,
    vtm: CimaItem,
    dosis: String,
}

#[derive(Deserialize, Debug)]
struct CimaEstado {
    aut: Option<i64>,
    rev: Option<i64>,
}

#[derive(Deserialize, Debug)]
struct CimaDocumento {
    tipo: i32,
    url: String,
    #[serde(rename = "urlHtml")]
    url_html: String,
    secc: bool,
    fecha: i64,
}

#[derive(Deserialize, Debug)]
struct CimaATC {
    codigo: String,
    nombre: String,
    nivel: i32,
}

#[derive(Deserialize, Debug)]
struct CimaPrincipioActivo {
    id: i32,
    codigo: String,
    nombre: String,
    cantidad: String,
    unidad: String,
    orden: i32,
}

#[derive(Deserialize, Debug)]
struct CimaPresentacion {
    cn: String,
    nombre: String,
    estado: CimaEstado,
    comerc: bool,
    psum: bool,
}

#[derive(Deserialize, Debug)]
struct CimaItem {
    id: i32,
    nombre: String,
}