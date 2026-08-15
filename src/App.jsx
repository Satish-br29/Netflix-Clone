import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MyListProvider } from './context/MyListContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage/LandingPage';
import BrowsePage from './pages/BrowsePage/BrowsePage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Redirect authenticated users away from landing/login/signup
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        backgroundColor: '#141414',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="netflix-wordmark" style={{ fontSize: '3rem' }}>NETFLIX</div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/browse" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Protected routes */}
      <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MyListProvider>
          <AppRoutes />
        </MyListProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
