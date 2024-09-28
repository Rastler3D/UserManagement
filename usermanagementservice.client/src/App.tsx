import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import { AuthorizeRoute } from './components/AuthorizeRoute';
import { UserManagement } from './components/UserManagement';
import { Registration } from './components/Registration';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route element={<AuthorizeRoute />}>
                <Route path="/" element={<UserManagement />} />
            </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;