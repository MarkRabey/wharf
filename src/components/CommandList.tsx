import * as React from 'react';
import * as ReactList from 'react-list';

import { ProcessList } from './ProcessList';

export class CommandList extends React.Component<any, any> {
  
  constructor(props: any) {
    super(props);
  }

  renderProcesses(index: string, key: string) {
    const { processes } = this.props.command;

    return <ProcessList
      process={ processes[index] }
      key={ `${ processes[index].pid }/${ processes[index].port }` }
    />
  }

  public render() {
    return (
      <div>
        <div className="process-list">
          <ReactList
            itemRenderer={ this.renderProcesses.bind(this) }
            length={ this.props.command.processes.length }
            type="simple"
          />
        </div>
      </div>
    );
  }
}