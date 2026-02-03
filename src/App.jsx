import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import ChangePassword from './components/pages/account/ChangePassword'
import MyCourses from './components/pages/account/MyCourses'
import WatchCourses from './components/pages/account/WatchCourses'
import CoursesEnrolled from './components/pages/account/CourcesEnrolled'
import Courses from './components/pages/Courses'
import Detail from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
					<Route path='/account/change-password' element={<ChangePassword/>}/>
					<Route path='/account/my-courses' element={<MyCourses/>}/>
					<Route path='/account/watch-course' element={<WatchCourses/>}/>
					<Route path='/account/courses-enrolled' element={<CoursesEnrolled/>}/>
					<Route path='/courses' element={<Courses/>}/>
					<Route path='/detail' element={<Detail/>}/>
					<Route path='/login' element={<Login/>}/>
					<Route path='/register' element={<Register/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
