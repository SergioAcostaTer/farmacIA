mod commands;
mod db;
mod models;

use tauri::Builder;
use commands::search_medications;
use tauri_plugin_updater;


fn main() {
    Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![search_medications])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}