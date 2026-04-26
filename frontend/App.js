import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// User screens
import LoginScreen        from "./screens/LoginScreen";
import RegisterScreen     from "./screens/RegisterScreen";
import GoalScreen         from "./screens/GoalScreen";
import MeasurementsScreen from "./screens/MeasurementsScreen";
import DailyTargetsScreen from "./screens/DailyTargetsScreen";
import AdminLoginScreen   from "./screens/AdminLoginScreen";
import TabNavigator       from "./navigation/TabNavigator";
import AdminTabNavigator  from "./navigation/AdminTabNavigator";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { getUserEmail } from "./utils/session";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [],
  config: {
    screens: {
      Login: "login",
      Register: "register",
      Goal: "goal",
      Measurements: "measurements",
      DailyTargets: "daily-targets",
      Tabs: {
        screens: {
          Dashboard: "dashboard",
          Workouts: "workouts",
          "Vedio Library": "video-library",
          "Progress Tracking": "progress",
          Profile: "profile",
          Goal: "goal-tab",
        },
      },
      AdminLogin: "admin/login",
      AdminTabs: {
        screens: {
          AdminDashboard: "admin/dashboard",
          ManageUsers: "admin/users",
          ManageMeals: "admin/meals",
          CalorieLogs: "admin/calorie-logs",
          ManageWorkouts: "admin/workouts",
          ManageVideos: "admin/videos",
          Reports: "admin/reports",
        },
      },
    },
  },
};

export default function App() {
  const hasSession = !!getUserEmail();

  return (
    <AdminAuthProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={hasSession ? "Tabs" : "Login"}
        >

          {/* User (mobile) flow */}
          <Stack.Screen name="Login"        component={LoginScreen} />
          <Stack.Screen name="Register"     component={RegisterScreen} />
          <Stack.Screen name="Goal"         component={GoalScreen} />
          <Stack.Screen name="Measurements" component={MeasurementsScreen} />
          <Stack.Screen name="DailyTargets" component={DailyTargetsScreen} />
          <Stack.Screen name="Tabs"         component={TabNavigator} />

          {/* Admin flow */}
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminTabs"  component={AdminTabNavigator} />

        </Stack.Navigator>
      </NavigationContainer>
    </AdminAuthProvider>
  );
}
