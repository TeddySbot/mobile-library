import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// On importe nos deux vues
import Home from './views/Home';
import Details from './views/Details';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Bienvenue' }} 
        />
        <Stack.Screen 
          name="Details" 
          component={Details} 
          options={{ title: 'Mon Profil' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}