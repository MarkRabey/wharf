import * as React from 'react';
import * as processes from 'listening-processes';
import * as classNames from 'classnames';

export class ProcessList extends React.Component<any, any> {
   
  state: any;

  constructor(props: any) {
    super(props);

    this.state = {
      processing: false,
      showDialog: false
    };
  }

  toggleDialog () {
    this.setState({ showDialog: !this.state.showDialog });
  }

  killPort() {
    const { pid } = this.props.process;
    this.setState({ processing: true, showDialog:false }, () => {
      let results = processes.kill(pid);
      if (results.fail.includes(pid)) {
        this.setState({ processing: true, showDialog: false });
      }
    });
  }

  renderDialog() {
    if (this.state.showDialog) {
      return (
        <div className="dialog">
          <div className="dialog__inner">
            Do you really want to kill the process with PID { this.props.process.pid }?
            <br />
            <span className="dialog__button dialog__button--confirm" onClick={ this.killPort.bind(this) }>Yes</span>
            <span className="dialog__button dialog__button--cancel" onClick={ this.toggleDialog.bind(this) }>No</span>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    const wrapperClass = classNames(
      'process',
      { 'process--processing': this.state.processing }
    );
    return (
      <div className={ wrapperClass }>
        { this.renderDialog() }
        <div className="process__details process__details--inline">
          <span className="process__label">URL: </span>
          <span className="process__detail">
            <a target="_blank" href={'http://localhost:' + this.props.process.port}>
              <span className="process__local-host">http://localhost:</span>
              <span className="process__port-number">{this.props.process.port}</span>
            </a>
          </span>
        </div>

        <div className="process__details process__details--inline">
          <span className="process__label">PID: </span>
          <span className="process__detail">{this.props.process.pid}</span>
          <a className="process__detail process__detail--kill" onClick={ this.toggleDialog.bind(this) } title="Kill Process">x</a>
        </div>

        <div className="process-details">
          <span className="process__label">Invoking Command: </span>
          <div className="process__detail process__invoking-command">{ this.props.process.invokingCommand }</div>
        </div>

      </div>
    );
  }
}