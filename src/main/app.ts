import {app, nativeImage } from 'electron';
import { WharfTray } from './tray';

export class App {
  tray: WharfTray;

  /**
   * Starts Wharf Application
   */
  constructor() {
    app.dock.hide();

    const icon = nativeImage.createEmpty();
    this.tray = new WharfTray(icon);
  }
}