import { app, BrowserWindow, ipcMain, Tray, Menu, shell, systemPreferences } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null = null;
let tray: Electron.Tray | null = null;

app.dock.hide();

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({strategy: 'react-hmr'});
}

const createWindow = async () => {
  const iconPath = path.join(__dirname, `/assets/icons/icon.png`);
  tray = new Tray(iconPath);

  systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
    mainWindow.webContents.send('theme-changed');
  });

  tray.on('click', function(event) {
    toggleWindow();

    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({ mode: 'detach' });
    }
  });

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Wharf',
      click: () => {
        shell.openExternal('https://markrabey.github.io/wharf/')
      } 
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });

  let appMenuTemplate = [{
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }
    ]
  }];

  let appMenu = Menu.buildFromTemplate(appMenuTemplate);
  Menu.setApplicationMenu(appMenu);

  tray.setToolTip('Wharf');

  mainWindow = new BrowserWindow({
    width: 350,
    height: 400,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
  });

  mainWindow.loadURL(`file://${ __dirname }/index.html`);

  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = mainWindow.getBounds();
  let x = 0;
  let y = 0;
  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
    y = Math.round(trayPos.y + trayPos.height);

  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  mainWindow.setPosition(x, y, false);
  mainWindow.show();
  mainWindow.focus();
}

ipcMain.on('show-window', () => {
  showWindow();
});

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
