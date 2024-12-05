
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './components/conntent/Landing'
import ChatWindow from './components/conntent/ChatWindow'

function App() {
  return <>
    <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/chat' element={<ChatWindow />} />
    </Routes>
  </>
}

export default App
