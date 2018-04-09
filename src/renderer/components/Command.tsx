import * as React from 'react';

export class Command extends React.Component {
  props: any;

  constructor(props: any) {
    super(props);
  }

  renderProcess() {

  }

  render() {
    return (
      <div className="">
        { this.props.command }
      </div>
    );
  }
}