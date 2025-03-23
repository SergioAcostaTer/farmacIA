use tauri::command;
use reqwest::Client;
use scraper::{Html, Selector};

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

    // Extract content from the div with class "col-md-9 col-sm-12 pvh100"
    let cleaned_content = extract_col_md_9_content(&html_content)?;
    
    // Format the cleaned content as HTML with Tailwind and shadcn/ui styling
    let formatted_html = format_as_tailwind_html(&cleaned_content)?;
    
    Ok(formatted_html)
}

// Helper function to extract content from the specified div class (unchanged)
fn extract_col_md_9_content(html: &str) -> Result<String, String> {
    let document = Html::parse_document(html);
    
    // Selector for the div with class "col-md-9 col-sm-12 pvh100"
    let div_selector = Selector::parse(".col-md-9.col-sm-12.pvh100")
        .map_err(|_| "Failed to parse div selector")?;
    
    let mut result = String::new();

    // Find the div and extract all text within it
    for div in document.select(&div_selector) {
        // Extract all text recursively from the div, preserving structure with newlines
        let text_content = div.text()
            .collect::<Vec<_>>()
            .join("\n")
            .trim()
            .to_string();
        
        if !text_content.is_empty() {
            result.push_str(&text_content);
            result.push_str("\n\n"); // Add spacing between sections if multiple divs exist
        }
    }

    if result.is_empty() {
        return Err("No content found in div with class 'col-md-9 col-sm-12 pvh100'".to_string());
    }
    
    Ok(result)
}

// New function to format the text as HTML with Tailwind and shadcn/ui styling
fn format_as_tailwind_html(text: &str) -> Result<String, String> {
    let mut html = String::from(r#"<div class="max-w-4xl mx-auto p-6 font-sans">"#);

    let lines: Vec<&str> = text.lines().collect();
    let mut in_list = false;

    for (i, line) in lines.iter().enumerate() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }

        // Check for section headings (e.g., "1. ", "4.1. ")
        if trimmed.chars().next().unwrap_or(' ').is_digit(10) && trimmed.contains('.') {
            let parts: Vec<&str> = trimmed.splitn(2, '.').collect();
            let number = parts[0];
            let content = parts[1].trim();

            if number.contains('.') {
                // Subheading (e.g., "4.1.")
                html.push_str(&format!(
                    r#"<h2 class="text-xl font-semibold mt-6 mb-2">{}. {}</h2>"#,
                    number, content
                ));
            } else {
                // Main heading (e.g., "1.")
                html.push_str(&format!(
                    r#"<h1 class="text-2xl font-bold mt-8 mb-4">{}. {}</h1>"#,
                    number, content
                ));
            }
        } else if trimmed.starts_with('-') || (i > 0 && lines[i - 1].trim().ends_with(':')) {
            // List item detection
            if !in_list {
                html.push_str(r#"<ul class="list-disc pl-6 mb-4">"#);
                in_list = true;
            }
            html.push_str(&format!(
                r#"<li class="text-base mb-1">{}</li>"#,
                trimmed.trim_start_matches('-').trim()
            ));
        } else {
            // Close list if it was open
            if in_list {
                html.push_str("</ul>");
                in_list = false;
            }
            // Regular paragraph
            html.push_str(&format!(
                r#"<p class="text-base mb-4">{}</p>"#,
                trimmed
            ));
        }
    }

    // Close any open list
    if in_list {
        html.push_str("</ul>");
    }

    html.push_str("</div>");
    Ok(html)
}