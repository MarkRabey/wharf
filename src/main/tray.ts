import * as Electron from 'electron';

export class Tray {
  
  constructor() {
    const icon = Electron.nativeImage.createEmpty();

    this.tray = new Electron.Tray(icon);

    this.tray.on('click', () => (this.clickHandler || (() => {}))());
    this.tray.setToolTip('Wharf');

    const contextMenu = Electron.Menu.buildFromTemplate([
      { label: 'Quit', click: () => Electron.app.quit() }
    ]);

    this.tray.on('right-click', () => this.tray.popUpContextMenu(contextMenu));
  }

  getBounds() {
    return this.tray.getBounds();
  }

  getLabel() {
    return this.label;
  }

  onClick(fn) {
    this.clickHandler = fn;
  }
}