import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import * as Electron from 'electron';
import * as url from 'url';
import * as path from 'path';

import { Tray } from './tray';

export class App {
  /**
   * Starts Wharf Application
   */
  constructor() {
    this.isDev = !!process.execPath.match(/[\\/]electron/);

    Electron.app.dock.hide();

    this.tray = new Tray();

    this.registerListeners();

    this.window = this.createWindow();
  }

  registerListeners() {
    // Tray
    this.tray.onClick(() => {
      const bounds = this.tray.getBounds();
      const currentMousePosition = Electron.screen.getCursorScreenPoint();
      const currentDisplay = Electron.screen.getDisplayNearestPoint(currentMousePosition);

      this.setPosition(
        bounds.x + (bounds.width / 2),
        currentDisplay.workArea.y
      );

      if (this.isVisible()) {
        this.hide();
      } else {
        this.show();
      }
    });

    // Listen for dark mode changed notification
    Electron.systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification',
      () => this.onDarkModeChanged()
    );
  }

  onDarkModeChanged() {
    // Close Existing Window
    this.window.close();

    // Create New Window
    this.window = this.createWindow();
  }

  onBlur() {
    this.hide();
  }

  createWindow() {
    const win = new Electron.BrowserWindow({
      width: 350,
      height: 400,
      frame: false,
      show: false,
      resizable: false,
      alwaysOnTop: true,
    });

    win.on('blur', () => this.onBlur());

    if (this.isDev) {
      win.loadURL(`http://localhost:2003`);
      installExtension(REACT_DEVELOPER_TOOLS);
      win.webContents.openDevTools({ mode: 'detach' });
    } else {
      win.loadURL(
        url.format({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true
        })
      );
    }

    return win;
  }

  show() {
    this.window.show();
  }

  hide() {
    this.window.hide();
  }

  isVisible() {
    return this.window.isVisible();
  }

  setPosition(x, y, centerToX = true) {
    this.window.setPosition(
      centerToX ? Math.round(x - (this.window.getSize()[0] / 2)) : x,
      y
    );
  }
}