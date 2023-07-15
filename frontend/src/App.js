import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import Registration from './pages/registrationPage';
import ProfilePage from './pages/profilePage';
import { AuthConstProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SecurityQuestionPage from './pages/securityQuestionPage';
import LoginSecurityQuestions from './pages/LoginSecurityQuestionsPage';

function App() {
  return (
    <>
      <BrowserRouter>

        <AuthConstProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Registration />} />
            <Route path='/' element={<Home />} />
            <Route path='/securityQuestion' element={ <ProtectedRoute> <SecurityQuestionPage /> </ProtectedRoute>} />
            <Route path='/profilePage' element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
            <Route path='/loginSecurityQuestions' element={<LoginSecurityQuestions />} />
          </Routes>
        </AuthConstProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
