import { app, nativeImage } from 'electron';
import * as path from 'path';
import { WharfTray } from './tray';

export class App {
  tray: WharfTray;

  /**
   * Starts Wharf Application
   */
  constructor() {
    app.dock.hide();

    // const icon = nativeImage.createEmpty();
    // console.log('../assets/icons/icon.png');
    this.tray = new WharfTray(path.join(__dirname, `/assets/icons/icon.png`));
  }
}
