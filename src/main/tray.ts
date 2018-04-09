import { Tray, Menu, app, nativeImage, shell, dialog } from 'electron';

import * as processes from 'listening-processes';
import * as _ from 'lodash';

import { WharfMenu } from './wharf-menu';

export class WharfTray extends Tray {
  label: string = '';
  processes: any[] = [];
  menu: WharfMenu | undefined = undefined;
  timeout: any;

  constructor(icon: any) {
    super(icon);
    this.setTitle('Wharf');
    this.setToolTip('Wharf');

    this.on('click', this.createMenu);
  }

  createMenu() {
    this.processes = this.getProcesses();
    this.menu = undefined;
    this.menu = new WharfMenu(this.processes);

    this.popUpContextMenu(this.menu);
  }

  getProcesses(): any[] {
    const processesArray = _.map(processes(), (processes: any, command: any) => {
      return {
        processes,
        command
      };
    });

    processesArray.sort((a: any, b: any) => {
      let commandA = a.command.toLowerCase();
      let commandB = b.command.toLowerCase();
      return commandA < commandB ? -1 : commandA > commandB ? 1 : 0;
    });

    return processesArray;
  }
}
