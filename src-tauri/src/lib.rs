// src-tauri/src/main.rs

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn search_drugs(query: String) -> String {
    format!("Resultados para: {}", query)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init()) 
        .invoke_handler(tauri::generate_handler![
            greet, 
            search_drugs 
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}