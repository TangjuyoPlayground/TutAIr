import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AuthGuard from './components/AuthGuard'
import Home from './pages/Home'
import CreateCourse from './pages/CreateCourse'
import Course from './pages/Course'
import Market from './pages/Market'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
                <Route index element={<Home />} />
                <Route path="create" element={<CreateCourse />} />
                <Route path="course/:id" element={<Course />} />
                <Route path="market" element={<Market />} />
            </Route>
        </Routes>
    )
}

export default App


