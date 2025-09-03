import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ScrollBackgroundVideo from './ScrollBackgroundVideo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <ScrollBackgroundVideo src="/0001-0120.webm" heightPerSecond={2560} />
    </div>
  )

}

export default App

