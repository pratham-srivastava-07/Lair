import {  Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import Landing from './components/conntent/Landing'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
  )
}

export default App

