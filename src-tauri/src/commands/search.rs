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

// #[command]
// pub async fn get_document_content(nregistro: String, tipo_doc: i32, seccion: Option<String>) -> Result<String, String> {
//     let client = Client::new();
//     let mut url = format!(
//         "https://cima.aemps.es/cima/rest/docSegmentado/contenido/{}?nregistro={}",
//         tipo_doc, nregistro
//     );

//     if let Some(sec) = seccion {
//         url.push_str(&format!("&seccion={}", sec));
//     }

//     let response = client
//         .get(&url)
//         .header("Accept", "text/html") // Request HTML content
//         .send()
//         .await
//         .map_err(|e| format!("Failed to fetch document content: {}", e))?;

//     if response.status().is_success() {
//         let html_content = response
//             .text()
//             .await
//             .map_err(|e| format!("Failed to get HTML content: {}", e))?;
//         Ok(html_content)
//     } else {
//         Err(format!("API error: {}", response.status()))
//     }
// }