import * as Electron from 'electron';
export declare class App {
    isDev: boolean;
    /**
     * Starts Wharf Application
     */
    constructor();
    createWindow(): Electron.BrowserWindow;
    onBlur(): void;
}
