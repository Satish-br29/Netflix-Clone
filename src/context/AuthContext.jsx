// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// const API_URL = 'https://netflix-clone-5ayq.onrender.com/api/auth';

// // Create axios instance with credentials for HTTP-only cookies
// const authApi = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // On mount, verify existing session
//   useEffect(() => {
//     verifyUser();
//   }, []);

//   const verifyUser = async () => {
//     try {
//       const token = localStorage.getItem('netflix_token');
//       const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
//       const res = await authApi.get('/verify', config);
//       if (res.data.success) {
//         setUser(res.data.user);
//       }
//     } catch (err) {
//       setUser(null);
//       localStorage.removeItem('netflix_token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const res = await authApi.post('/login', { email, password });
//     if (res.data.success) {
//       setUser(res.data.user);
//       if (res.data.token) {
//         localStorage.setItem('netflix_token', res.data.token);
//       }
//     }
//     return res.data;
//   };

//   const register = async (email, password) => {
//     const res = await authApi.post('/register', { email, password });
//     if (res.data.success) {
//       setUser(res.data.user);
//       if (res.data.token) {
//         localStorage.setItem('netflix_token', res.data.token);
//       }
//     }
//     return res.data;
//   };

//   const logout = async () => {
//     try {
//       await authApi.post('/logout');
//     } catch (err) {
//       // Ignore errors on logout
//     }
//     setUser(null);
//     localStorage.removeItem('netflix_token');
//   };

//   const checkEmail = async (email) => {
//     const res = await authApi.post('/check-email', { email });
//     return res.data.exists;
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, verifyUser, checkEmail }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }





import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Render Backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://netflix-clone-5ayq.onrender.com/api/auth';

const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    try {
      const token = localStorage.getItem('netflix_token');

      const res = await authApi.get('/verify', {
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {},
      });

      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('netflix_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authApi.post('/login', {
      email,
      password,
    });

    if (res.data.success) {
      setUser(res.data.user);

      if (res.data.token) {
        localStorage.setItem('netflix_token', res.data.token);
      }
    }

    return res.data;
  };

  const register = async (email, password) => {
    const res = await authApi.post('/register', {
      email,
      password,
    });

    if (res.data.success) {
      setUser(res.data.user);

      if (res.data.token) {
        localStorage.setItem('netflix_token', res.data.token);
      }
    }

    return res.data;
  };

  const logout = async () => {
    try {
      await authApi.post('/logout');
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem('netflix_token');
    setUser(null);
  };

  const checkEmail = async (email) => {
    const res = await authApi.post('/check-email', {
      email,
    });

    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        verifyUser,
        checkEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
