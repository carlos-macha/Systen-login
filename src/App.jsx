import './App.css'
import Login from './components/login/Login';
import UpDatePassword from './updatePasswordScreen/upDatePassword';
import UserMaster from './components/userMaster/UserMaster';
import Normaluser from './components/normaluser/normaluser';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/protected_route/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute/>}>
            <Route path='/user-master' element={<UserMaster />} />
            <Route path='/normal-user' element={<Normaluser />} />
            <Route path='/UpDate-Password' element={<UpDatePassword />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
