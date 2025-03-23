use tauri::command;
use reqwest::Client;

#[command]
pub async fn get_medication_html_by_id(id: String) -> Result<String, String> {
    let client = Client::new();
    
    let url = format!("https://cima.aemps.es/cima/rest/medicamento?nregistro={}", id);
    let response = client
        .get(&url)
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| format!("Failed to fetch from CIMA API: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Medication with num_registro {} not found", id));
    }

    let cima_med: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse CIMA JSON: {}", e))?;
    
    let docs = cima_med.get("docs")
        .and_then(|d| d.as_array())
        .ok_or("No documents found in API response")?;
    
    let html_url = docs.iter()
        .find(|doc| doc.get("tipo").and_then(|t| t.as_i64()) == Some(1))
        .and_then(|doc| doc.get("urlHtml"))
        .and_then(|url| url.as_str())
        .ok_or("Ficha técnica HTML not found")?;

    let html_response = client
        .get(html_url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch HTML: {}", e))?;

    if !html_response.status().is_success() {
        return Err("Failed to retrieve HTML content".to_string());
    }

    let html_content = html_response
        .text()
        .await
        .map_err(|e| format!("Failed to get HTML content: {}", e))?;

    Ok(html_content)
}