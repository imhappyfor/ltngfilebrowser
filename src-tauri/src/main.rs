#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Menu, Submenu, CustomMenuItem};
use tauri::Manager;
#[tauri::command]
fn read_dir(path: String, show_hidden: bool) -> Result<Vec<serde_json::Value>, String> {
    let path = std::path::Path::new(&path);
    let entries = std::fs::read_dir(path).map_err(|e| e.to_string())?;
    
    let mut file_entries = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let file_name = entry.file_name().into_string().map_err(|_| "Invalid UTF-8")?;
        
        if !show_hidden && file_name.starts_with('.') {
            continue;
        }
        let file_type = entry.file_type().map_err(|e| e.to_string())?;
        let children = if file_type.is_dir() { Some(Vec::<serde_json::Value>::new()) } else { None };
        
        file_entries.push(serde_json::json!({
            "path": entry.path().to_str().map(String::from).ok_or("Invalid path")?,
            "name": file_name,
            "children": children,
            "is_dir": file_type.is_dir(),
        }));
    }
    
    Ok(file_entries)
}

fn main() {
  let file_menu = Submenu::new("File", Menu::new()
    .add_item(CustomMenuItem::new("new".to_string(), "New"))
    .add_item(CustomMenuItem::new("open".to_string(), "Open"))
    .add_item(CustomMenuItem::new("save".to_string(), "Save"))
    .add_item(CustomMenuItem::new("quit".to_string(), "Quit")));

  let edit_menu = Submenu::new("Edit", Menu::new()
    .add_item(CustomMenuItem::new("cut".to_string(), "Cut"))
    .add_item(CustomMenuItem::new("copy".to_string(), "Copy"))
    .add_item(CustomMenuItem::new("paste".to_string(), "Paste")));

  let view_menu = Submenu::new("View", Menu::new()
    .add_item(CustomMenuItem::new("toggle_hidden".to_string(), "Toggle Hidden Files"))
    .add_item(CustomMenuItem::new("refresh".to_string(), "Refresh")));

  let settings_menu = Submenu::new("Settings", Menu::new()
    .add_item(CustomMenuItem::new("preferences".to_string(), "Preferences")));

  let menu = Menu::new()
    .add_submenu(file_menu)
    .add_submenu(edit_menu)
    .add_submenu(view_menu)
    .add_submenu(settings_menu);

  tauri::Builder::default()
    .menu(menu)
    .setup(|app| {
      #[cfg(debug_assertions)]
      {
        let window = app.get_window("main").unwrap();
        window.open_devtools();
      }
      Ok(())
    })
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "quit" => {
          std::process::exit(0);
        }
        "new" => {
          // Handle new file
        }
        "open" => {
          // Handle open file@
        }
        "save" => {
          // Handle save file
        }
        "cut" => {
          // Handle cut
        }
        "copy" => {
          // Handle copy
        }
        "paste" => {
          // Handle paste
        }
        "toggle_hidden" => {
          // Toggle hidden files
        }
        "refresh" => {
          // Refresh file list
        }
        "preferences" => {
          // Open preferences
        }
        _ => {}
      }
    })
    .invoke_handler(tauri::generate_handler![read_dir])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
