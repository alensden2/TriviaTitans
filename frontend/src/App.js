import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import Registration from './pages/registrationPage';
import ProfilePage from './pages/profilePage';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Registration />}/>
      <Route path='/' element={<Home />}/>
      <Route path='/profilePage' element={<ProfilePage />}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
