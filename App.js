// In App.js in a new project
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/scenes/home';
import { NativeBaseProvider } from "native-base";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon, faCalendar, faClock, faUser } from "./src/assets/icons/icons"
import { flexes } from './src/styles/styles';
import SchedulingHistoric from './src/scenes/schedulingHistoric';
import Login from './src/scenes/login';
import VerifyLogin from './src/scenes/verifyLogin';
import ProfileScene from './src/scenes/ProfileScene';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Tab = createBottomTabNavigator();

function App() {
  const [data, setData] = React.useState(false)
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@login')
      if (value !== null) {

        setData(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  React.useEffect(() => {

    getData()
  }, [])
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: flexes.tabBottomStyle,
        }}

        >
          <Tab.Screen name="Home"
            options={{
              tabBarOptions: {
                showIcon: true
              },
              tabBarLabel: 'Agendamento',
              tabBarIcon: ({ color, size }) => {
                return <FontAwesomeIcon icon={faCalendar} color={color} size={size} />
              }
            }}
            component={HomeScreen} />
          <Tab.Screen name="Historico"
            options={{
              tabBarOptions: {
                showIcon: true
              },
              tabBarLabel: 'Histórico',
              tabBarIcon: ({ color, size }) => {
                return <FontAwesomeIcon icon={faClock} color={color} size={size} />
              },
              unmountOnBlur: true
            }}
            component={SchedulingHistoric} />
          <Tab.Screen name="Login"
            options={{
              tabBarOptions: {
                showIcon: false
              },
              tabBarLabel:"Login",
              tabBarIcon: ({ color, size }) => {
                return <FontAwesomeIcon icon={faUser} color={color} size={size} />
              },
              tabBarHideOnKeyboard: true
            }}
            component={data ? ProfileScene : Login} />
        </Tab.Navigator>
      </NavigationContainer>

    </NativeBaseProvider>

  );
}

export default App;