import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreateCourse from './pages/CreateCourse'
import Course from './pages/Course'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="create" element={<CreateCourse />} />
                <Route path="course/:id" element={<Course />} />
            </Route>
        </Routes>
    )
}

export default App
