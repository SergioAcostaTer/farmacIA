use sqlx::{sqlite::SqlitePool, Pool, Sqlite};
use std::sync::Arc;
use tokio::sync::RwLock;

pub type DbPool = Arc<RwLock<Pool<Sqlite>>>;

pub async fn init_db() -> DbPool {
    dotenv::dotenv().ok();
    let db_path = r"C:\Users\Sergio\Desktop\tauri\farmacIA\src-tauri\medicamentos.db";
    let pool = SqlitePool::connect(&db_path)
        .await
        .expect("Failed to connect to the database");

    Arc::new(RwLock::new(pool))
}