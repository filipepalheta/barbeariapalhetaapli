/**
 * @format
 */
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { LogBox } from "react-native"

AppRegistry.registerComponent(appName, () =>gestureHandlerRootHOC(App));
LogBox.ignoreAllLogs(true)