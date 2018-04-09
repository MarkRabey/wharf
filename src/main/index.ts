import * as Electron from 'electron';
import { App } from './app';

Electron.app.on('ready', () => new App());