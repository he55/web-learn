import Home from './src/Home'
import { StatusBar } from 'expo-status-bar'

export default function App() {
  return (
    <>
      <Home />
      <StatusBar hidden={true} />
    </>
  )
}
