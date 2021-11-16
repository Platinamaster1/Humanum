/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './src/Navigator';
import App from './src/Navigator';
//import 'react-native-reanimated'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();//Ignore all log notifications
