
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {

  return (
    <Router basename="/">
            <Routes>
                <Route path="/" element={<AdminDashboard/>} />
                <Route path="/form" element={<UserDashboard/>} />

                <Route path='*' element={<h1 className='text-5xl text-white text-center mt-56'>404 Not Found :(</h1>} />
            </Routes>
    </Router>
  )
}

export default App
