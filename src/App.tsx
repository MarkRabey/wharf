import * as React from 'react';
import * as _ from 'lodash';
import * as processes from 'listening-processes';
import * as ReactList from 'react-list';
import * as classNames from 'classnames';
import { ipcRenderer } from 'electron'

const { systemPreferences, shell, app } = require('electron').remote;

import { CommandList } from './components/CommandList';

export class App extends React.Component<any, any> {
  state: any;

  constructor(props: any = {}) {
    super(props);
    let processArray = this.getProcesses();

    this.state = {
      commands: processArray,
      app: {
        version: process.env.npm_package_version || app.getVersion(),
        isDarkMode: systemPreferences.isDarkMode()
      }
    }
  }

  componentWillMount() {
    this.updateProcesses();
  }

  componentDidMount() {
    ipcRenderer.on('theme-changed', () => {
      console.log('theme changed');
      const newState = {
        ...this.state,
        app: {
          ...this.state.app,
          isDarkMode: systemPreferences.isDarkMode(),
        }
      }

      this.setState(newState);
    });
  }

  getProcesses(): any[] {
    const processArray = _.map(processes(), (processes: any, command: any) => {
      return {
        processes,
        command: command,
      };
    });

    processArray.sort(function (a, b) {
      let commandA = a.command.toLowerCase();
      let commandB = b.command.toLowerCase();
      if (commandA < commandB) return -1;
      if (commandA > commandB) return 1;

      return 0;
    });

    return processArray;
  }

  updateProcesses() {
    const processArray = this.getProcesses();
    this.setState({
      commands: processArray
    }, () => {
      window.setTimeout(this.updateProcesses.bind(this), 2000);
    });
  }

  hideApp() {
    app.hide();
  }

  quitApp() {
    app.quit();
  }

  renderCommand(index: number) {
    return <CommandList
      command={ this.state.commands[index] }
      key={ this.state.commands[index].command }
      isDarkMode={ this.state.app.isDarkMode }
    />;
  }

  render() {
    let appClasses = classNames(
      'app',
      { 'app--dark-theme': this.state.app.isDarkMode }
    );

    return (
      <div className={ appClasses }>
        <div className="info">
          <div className="info__section info__section--logo" onClick={ () => shell.openExternal('https://markrabey.github.io/wharf/') }>
            Wharf <span className="version">v{ this.state.app.version }</span>
          </div>

          <div className="info__section info__section--hide-app" onClick={ this.hideApp.bind(this) }>–</div>
          <div className="info__section info__section--power-off" onClick={ this.quitApp.bind(this) }>X</div>
        </div>
        <div className="app__list">
          <ReactList 
            itemRenderer={ this.renderCommand.bind(this) }
            length={ this.state.commands.length }
            type="simple"
          />
        </div>
      </div>
    );
  }
}
