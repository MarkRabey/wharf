"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Electron = require("electron");
class App {
    /**
     * Starts Wharf Application
     */
    constructor() {
        this.isDev = !!process.execPath.match(/[\\/]electron/);
    }
    createWindow() {
        const win = new Electron.BrowserWindow({
            width: 350,
            height: 400,
            show: false,
            frame: false,
            resizable: false,
            transparent: true,
            alwaysOnTop: true,
        });
        win.on('blur', () => this.onBlur())
            .loadURL(`file://${__dirname}/index.html`);
        return win;
    }
    onBlur() {
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map