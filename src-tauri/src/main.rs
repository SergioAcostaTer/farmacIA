mod commands;
mod db;
mod models;

use tauri::Builder;
use commands::search_medications;

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![search_medications])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}