import * as React from 'react';
import * as _ from 'lodash';
import { hot } from 'react-hot-loader';
import * as processes from 'listening-processes';

import { ipcRenderer, systemPreferences, shell, app } from 'electron';

import { Command } from './Command';

export class App extends React.Component {
  processes: any;

  constructor(props: any = {}) {
    super(props);

    this.processes = this.getProcesses();

  }

  getProcesses(): any[] {
    const processesArray = _.map(processes(), (processes: any, command: any) => {
      return {
        processes,
        command,
      }
    });

    processesArray.sort((a: any, b: any) => {
      let commandA = a.command.toLowerCase();
      let commandB = b.command.toLowerCase();
      
      return (commandA < commandB ? -1 : commandA > commandB ? 1 : 0);
    });

    return processesArray;
  }

  render() {
    return (
      <div className="command-list">
        { this.processes.map((process: any) => (
          <Command key={ process.command } command={ process.command } />
        ))}
      </div>
    );
  }
}

export default hot(module)(App);