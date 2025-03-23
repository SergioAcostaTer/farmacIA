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

    let cleaned_content = extract_col_md_9_content(&html_content)?;
    let formatted_html = format_as_tailwind_html(&cleaned_content)?;
    
    Ok(formatted_html)
}

fn extract_col_md_9_content(html: &str) -> Result<String, String> {
    let document = Html::parse_document(html);
    let div_selector = Selector::parse(".col-md-9.col-sm-12.pvh100")
        .map_err(|_| "Failed to parse div selector")?;

    let mut result = String::new();
    let mut found_first_section = false;

    for div in document.select(&div_selector) {
        let text_content = div.text().collect::<Vec<_>>().join("\n").trim().to_string();
        
        if text_content.is_empty() {
            continue;
        }

        // Start capturing content only after finding "1. " (first major section)
        if !found_first_section {
            if let Some(pos) = text_content.find("\n1. ") {
                found_first_section = true;
                result.push_str(&text_content[pos + 1..]); // Include from "1. " onwards
                result.push_str("\n\n");
            }
        } else {
            result.push_str(&text_content);
            result.push_str("\n\n");
        }
    }

    if result.is_empty() {
        return Err("No valid content found in div with class 'col-md-9 col-sm-12 pvh100'".to_string());
    }

    Ok(result)
}


// Improved function to format the text as HTML with Tailwind and shadcn/ui styling
fn format_as_tailwind_html(text: &str) -> Result<String, String> {
    let mut html = String::from(r#"<div class="max-w-4xl mx-auto p-6 font-sans">"#);
    let lines: Vec<&str> = text.lines().collect();
    let mut in_list = false;
    let mut buffer = String::new();
    let mut skip_pdf = false;

    for (i, line) in lines.iter().enumerate() {
        let trimmed = line.trim();

        // Skip empty lines or standalone dots
        if trimmed.is_empty() || trimmed == "." {
            if !buffer.is_empty() && !skip_pdf {
                html.push_str(&format!(
                    r#"<p class="text-base mb-4">{}</p>"#,
                    buffer.trim()
                ));
                buffer.clear();
            }
            continue;
        }

        // Skip PDF notice fragments
        if trimmed.contains("Pulse aquí para ver el documento en formato PDF (Vínculo EMA)") {
            skip_pdf = true;
            buffer.clear(); // Clear buffer to avoid partial inclusion
            continue;
        }
        if skip_pdf {
            skip_pdf = false; // Reset after skipping
            continue;
        }

        // Check for section headings
        if trimmed.chars().next().unwrap_or(' ').is_digit(10) && trimmed.contains('.') && trimmed.split('.').next().unwrap().len() <= 2 {
            if !buffer.is_empty() {
                html.push_str(&format!(
                    r#"<p class="text-base mb-4">{}</p>"#,
                    buffer.trim()
                ));
                buffer.clear();
            }
            if in_list {
                html.push_str("</ul>");
                in_list = false;
            }

            let parts: Vec<&str> = trimmed.splitn(2, '.').collect();
            let number = parts[0].trim();
            let content = parts[1].trim();
            let clean_number = number.replace(" ", "");

            if clean_number.contains('.') {
                // Subheading (e.g., "4.1.")
                html.push_str(&format!(
                    r#"<h2 class="text-xl font-semibold mt-6 mb-2">{}. {}</h2>"#,
                    clean_number, content
                ));
            } else {
                // Main heading (e.g., "1.")
                html.push_str(&format!(
                    r#"<h1 class="text-2xl font-bold mt-8 mb-4">{}. {}</h1>"#,
                    clean_number, content
                ));
            }
        } else if trimmed.starts_with('-') || (i > 0 && lines[i - 1].trim().ends_with(':') && !trimmed.contains('.')) {
            // List item detection
            if !buffer.is_empty() {
                html.push_str(&format!(
                    r#"<p class="text-base mb-4">{}</p>"#,
                    buffer.trim()
                ));
                buffer.clear();
            }
            if !in_list {
                html.push_str(r#"<ul class="list-disc pl-6 mb-4">"#);
                in_list = true;
            }
            html.push_str(&format!(
                r#"<li class="text-base mb-1">{}</li>"#,
                trimmed.trim_start_matches('-').trim()
            ));
        } else {
            // Buffer lines that might belong together
            if i > 0 && !lines[i - 1].trim().is_empty() && !lines[i - 1].trim().ends_with('.') && !trimmed.starts_with('1') && !trimmed.contains('.') {
                buffer.push_str(" ");
                buffer.push_str(trimmed);
            } else {
                if !buffer.is_empty() {
                    html.push_str(&format!(
                        r#"<p class="text-base mb-4">{}</p>"#,
                        buffer.trim()
                    ));
                    buffer.clear();
                }
                if in_list {
                    html.push_str("</ul>");
                    in_list = false;
                }
                buffer.push_str(trimmed);
            }
        }
    }

    // Flush remaining buffer content
    if !buffer.is_empty() {
        html.push_str(&format!(
            r#"<p class="text-base mb-4">{}</p>"#,
            buffer.trim()
        ));
    }
    if in_list {
        html.push_str("</ul>");
    }

    html.push_str("</div>");
    Ok(html)
}