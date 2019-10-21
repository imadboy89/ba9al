import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

const bottomTabNavigator = createBottomTabNavigator(
    {
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Icon name="home" size={25} color={tintColor} />
          )
        }
      },
      Explore: {
        screen: ExploreScreen,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => (
            <Icon name="search" size={25} color={tintColor} />
          )
        }
      },
    },
    {
      initialRouteName: 'Home',
      tabBarOptions: {
        activeTintColor: '#eb6e3d'
      }
    }
  );

  export default bottomTabNavigator;