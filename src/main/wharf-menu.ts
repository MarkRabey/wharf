import { Menu, MenuItem, shell, dialog } from 'electron';
import * as processes from 'listening-processes';

export class WharfMenu extends Menu {
  processes: any[];

  constructor(processes: any) {
    super();
    this.processes = processes;

    this.addCommands();
    this.addAppItems();
  }

  addCommands() {
    this.processes.forEach(process => {
      const itemConfig: any = {
        label: process.command
      };

      if (process.processes.length > 0) {
        itemConfig.submenu = this.createSubmenu(process);
      }

      this.append(new MenuItem(itemConfig));
    });
  }

  createSubmenu(process: any) {
    const submenu: any[] = [];
    const pid = process.processes[0].pid;

    process.processes.forEach((process: any) => {
      const url = `http://localhost:${process.port}`;
      submenu.push({
        label: url,
        click: () => shell.openExternal(url)
      });
    });

    submenu.push(
      { type: 'separator' },
      {
        label: `Kill Process (${pid})`,
        click: () => this.handleProcessKill(pid)
      }
    );

    return submenu;
  }

  handleProcessKill(pid: any) {
    dialog.showMessageBox(
      {
        type: 'question',
        title: 'Are you sure?',
        message: `Kill process ${pid}?`,
        buttons: ['Ok', 'Cancel']
      },
      (selectedIndex: number) => {
        if (selectedIndex === 0) {
          const result = processes.kill(pid);
          if (result.success.includes(pid)) {
            console.log(`Killed ${pid}`);
          } else {
            alert(`Could not kill process ${pid}`);
          }
        }
      }
    );
  }

  addAppItems() {
    this.addSeparator();
    this.append(new MenuItem({ role: 'about' }));
    this.addSeparator();
    this.append(new MenuItem({ role: 'quit' }));
  }

  addSeparator() {
    this.append(new MenuItem({ type: 'separator' }));
  }
}
