import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="login"/>
      <Stack.Screen name="signup"/>
      <Stack.Screen name="forgot"/>
    </Stack>
  )
}