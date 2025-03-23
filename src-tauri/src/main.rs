#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod db;
mod models;

use tauri::Builder;

pub use commands::search::search_medications;
pub use commands::medication::get_medication_html_by_id;
pub use commands::search::get_medication_by_num_registro;

fn main() {
    Builder::default()
        .invoke_handler(tauri::generate_handler![
            search_medications,
            get_medication_html_by_id,
            get_medication_by_num_registro
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}