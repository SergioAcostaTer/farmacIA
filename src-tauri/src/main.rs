use sqlx::{sqlite::SqlitePool, Pool, Sqlite};
use tauri::command;
use serde::Serialize;
use std::env;
use tokio::sync::RwLock;
use std::sync::Arc;

#[derive(Serialize, Debug, sqlx::FromRow)]
struct Medication {
    id: i32,
    num_registro: String,
    medicamento: String,
    laboratorio: String,
    fecha_aut: String,
    estado: String,
    fecha_estado: String,
    cod_atc: String,
    principios_activos: String,
    num_p_activos: i32,
    comercializado: String,
    triangulo_amarillo: String,
    observaciones: String,
    sustituible: String,
    afecta_conduccion: String,
    problemas_suministro: String,
}

type DbPool = Arc<RwLock<Pool<Sqlite>>>;

async fn init_db() -> DbPool {
    dotenv::dotenv().ok();
    let db_path = r"C:\Users\Sergio\Desktop\tauri\farmacIA\src-tauri\medicamentos.db";
    let pool = SqlitePool::connect(&db_path)
        .await
        .expect("Failed to connect to the database");

    Arc::new(RwLock::new(pool))
}

#[command]
async fn search_medications(query: String) -> Vec<Medication> {
    let pool = init_db().await;

    let query_param = format!("%{}%", query);
    let result = sqlx::query_as::<_, Medication>(
        r#"
        SELECT * FROM medicamentos 
        WHERE medicamento LIKE ? OR laboratorio LIKE ? OR estado LIKE ?
        LIMIT 5
        "#
    )
    .bind(&query_param)
    .bind(&query_param)
    .bind(&query_param)
    .fetch_all(&*pool.read().await)
    .await
    .unwrap_or_else(|_| Vec::new());

    result
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![search_medications])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}