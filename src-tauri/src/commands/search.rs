use crate::db::{DbPool, init_db};
use crate::models::Medication;
use tauri::command;

#[command]
pub async fn search_medications(query: String) -> Vec<Medication> {
    let pool: DbPool = init_db().await;

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