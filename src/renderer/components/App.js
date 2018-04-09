"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const react_hot_loader_1 = require("react-hot-loader");
const processes = require("listening-processes");
const Command_1 = require("./Command");
class App extends React.Component {
    constructor(props = {}) {
        super(props);
        this.processes = this.getProcesses();
    }
    getProcesses() {
        const processesArray = _.map(processes(), (processes, command) => {
            return {
                processes,
                command,
            };
        });
        processesArray.sort((a, b) => {
            let commandA = a.command.toLowerCase();
            let commandB = b.command.toLowerCase();
            return (commandA < commandB ? -1 : commandA > commandB ? 1 : 0);
        });
        return processesArray;
    }
    render() {
        return (React.createElement("div", { className: "command-list" }, this.processes.map((process) => (React.createElement(Command_1.Command, { key: process.command, command: process.command })))));
    }
}
exports.App = App;
exports.default = react_hot_loader_1.hot(module)(App);
//# sourceMappingURL=App.js.map