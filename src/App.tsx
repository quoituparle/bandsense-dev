import { Routes, Route } from 'react-router-dom'
import Login from './auth/login'
import Registration from './auth/register'
import Verification from './auth/verify-email'
import Main from './client/main'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path='/verify-email' element={<Verification />} />
      </Routes>
    </div>
  )
}

export default App