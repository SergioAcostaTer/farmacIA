#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod models;

use tauri::Builder;

pub use commands::search::search_medications;
pub use commands::medication::get_medication_html_by_id;

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            search_medications,
            get_medication_html_by_id
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}