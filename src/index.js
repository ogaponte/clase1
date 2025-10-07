const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// --- PostgreSQL integration ---
const { ipcMain } = require('electron');
const { Client } = require('pg');

ipcMain.handle('get-pieces', async () => {
  // Cambia los valores de conexión según tu entorno
  const client = new Client({
    user: 'postgres', // Cambia si tu usuario es diferente
    host: 'localhost',
    database: 'clase1',
    password: 'postgres', // Cambia si tu password es diferente
    port: 5432,
  });
  try {
    await client.connect();
    const res = await client.query('SELECT id, piece, create_datetime FROM pieces ORDER BY id');
    await client.end();
    return res.rows;
  } catch (err) {
    return { error: err.message };
  }
});
