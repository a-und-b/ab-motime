const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const server = require('./server/server');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // In production, load the built app
  if (process.env.NODE_ENV === 'production') {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'client/dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    // In development, load from the dev server
    win.loadURL('http://localhost:8080');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const serverInstance = server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
  
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 

