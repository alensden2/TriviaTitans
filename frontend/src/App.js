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
import TeamMgmt from './pages/teamMgmt';
import CreateGame from './pages/createGame';
import AddQuestion from './pages/addQuestion';
import ListQuestsions from './pages/listQuestions';
import UpdateQuestion from './pages/updateQuestion';
import ListGames from './pages/listGames';
import UpdateGame from './pages/updateGame';
import Lex from './pages/Lex';
import LookerStudio from './pages/LookerStudio';
import Admin from './pages/admin';
import TriviaGameLobby from './pages/TriviaGameLobby';
import Createquiz from './pages/createquiz';
import Leaderboard from './pages/leaderboard';

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
            <Route path='/teamMgmt' element={<ProtectedRoute> <TeamMgmt /> </ProtectedRoute>} />
            <Route path='/creategame' element={<CreateGame />} />
            <Route path='/addquestion' element={<AddQuestion />} />
            <Route path='/listquestions' element={<ListQuestsions />} />
            <Route path='/updatequestion' element={<UpdateQuestion />} />
            <Route path='/listgames' element={<ListGames />} />
            <Route path='/updategame' element={<UpdateGame />} />
            <Route path='/lex' element={<Lex />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/lookerstudio' element={<LookerStudio />} />
            <Route path='/lobby' element={<TriviaGameLobby />} />
            <Route path='/quizes' element={<Createquiz />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
          </Routes>
        </AuthConstProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
