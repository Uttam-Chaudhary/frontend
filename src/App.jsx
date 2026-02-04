
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import ChangePassword from './components/pages/account/ChangePassword'
import MyCourses from './components/pages/account/MyCourses'
import WatchCourses from './components/pages/account/WatchCourses'
import MyLearning from './components/pages/account/MyLearning'
import Courses from './components/pages/Courses'
import Detail from './components/pages/Detail'
import Login from './components/pages/account/Login'
import Register from './components/pages/Register'




function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
					<Route path='/account/change-password' element={<ChangePassword/>}/>
					<Route path='/account/my-courses' element={<MyCourses/>}/>
					<Route path='/account/watch-course' element={<WatchCourses/>}/>
					<Route path='/account/my-learning' element={<MyLearning/>}/>
					<Route path='/courses' element={<Courses/>}/>
					<Route path='/detail' element={<Detail/>}/>
					<Route path='/account/login' element={<Login/>}/>
					<Route path='/register' element={<Register/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
