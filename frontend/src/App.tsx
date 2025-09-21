import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Friends from './components/Friends';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';

// Premium Login component with animations
const LoginForm = () => {
  const [email, setEmail] = React.useState('user1@example.com');
  const [password, setPassword] = React.useState('password123');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(true);

  // Check if user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    setAnimating(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Вход успешен! Добро пожаловать, ${data.data.user.name}!`);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setUser(data.data.user);
        setTimeout(() => window.location.href = '/dashboard', 1000);
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка соединения: ${error.message}`);
    }
    
    setLoading(false);
    setAnimating(false);
  };


  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s infinite linear'
      }} />
      
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-50px, -50px) rotate(360deg); }
        }
        @keyframes slideIn {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '50px 40px',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
        margin: '20px',
        animation: 'slideIn 0.8s ease-out'
      }}>
             {/* Welcome Message */}
             {showWelcome && (
               <div style={{
                 background: 'linear-gradient(135deg, #667eea, #764ba2)',
                 color: 'white',
                 padding: '20px 25px',
                 borderRadius: '16px',
                 marginBottom: '30px',
                 boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
                 animation: 'slideIn 0.8s ease-out',
                 position: 'relative',
                 overflow: 'hidden'
               }}>
                 <div style={{
                   position: 'absolute',
                   top: '-30px',
                   right: '-10px',
                   fontSize: '80px',
                   opacity: 0.1,
                   transform: 'rotate(15deg)'
                 }}>
                   👋
                 </div>
                 <div style={{ position: 'relative', zIndex: 1 }}>
                   <h2 style={{ 
                     margin: '0 0 8px 0', 
                     fontSize: '20px', 
                     fontWeight: '700',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px'
                   }}>
                     👋 Добро пожаловать!
                   </h2>
                   <p style={{ 
                     margin: 0, 
                     fontSize: '14px', 
                     opacity: 0.9 
                   }}>
                     Войдите в свой аккаунт или создайте новый
                   </p>
                 </div>
                 <button
                   onClick={() => setShowWelcome(false)}
                   style={{
                     position: 'absolute',
                     top: '10px',
                     right: '10px',
                     background: 'rgba(255, 255, 255, 0.2)',
                     border: 'none',
                     color: 'white',
                     width: '25px',
                     height: '25px',
                     borderRadius: '50%',
                     cursor: 'pointer',
                     fontSize: '14px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'all 0.3s ease'
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                   }}
                 >
                   ✕
                 </button>
               </div>
             )}

             {/* Logo and Title */}
             <div style={{ marginBottom: '40px' }}>
               <div style={{
                 width: '80px',
                 height: '80px',
                 background: 'linear-gradient(135deg, #667eea, #764ba2)',
                 borderRadius: '20px',
                 margin: '0 auto 20px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '32px',
                 animation: 'pulse 2s infinite'
               }}>
                 🏆
               </div>
               <h1 style={{ 
                 color: '#2d3748', 
                 marginBottom: '10px',
                 fontSize: '28px',
                 fontWeight: '700',
                 background: 'linear-gradient(135deg, #667eea, #764ba2)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent'
               }}>
                 Sport Achievements
               </h1>
               <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
                 Отслеживайте свои спортивные достижения
               </p>
             </div>
        
        {/* Form */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '25px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 50px 16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#718096'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button 
          onClick={handleLogin}
          disabled={loading}
          style={{
            background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            width: '100%',
            marginBottom: '25px',
            transition: 'all 0.3s ease',
            transform: loading ? 'none' : 'translateY(0)',
            boxShadow: loading ? 'none' : '0 10px 25px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Вход...
            </span>
          ) : 'Войти в аккаунт'}
        </button>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        {/* Message */}
        {message && (
          <div style={{
            padding: '15px 20px',
            borderRadius: '12px',
            background: message.includes('✅') ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
            color: message.includes('✅') ? '#22543d' : '#742a2a',
            marginBottom: '25px',
            border: `1px solid ${message.includes('✅') ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)'}`,
            animation: message.includes('❌') ? 'shake 0.5s ease-in-out' : 'slideIn 0.3s ease-out'
          }}>
            {message}
          </div>
        )}

        {/* Register Link */}
        <div style={{ 
          background: 'rgba(102, 126, 234, 0.1)', 
          padding: '20px', 
          borderRadius: '12px',
          fontSize: '14px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 15px 0', color: '#4a5568' }}>
            Нет аккаунта? Создайте новый!
          </p>
          <button 
            onClick={() => window.location.href = '/register'}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            📝 Создать аккаунт
          </button>
        </div>

        {/* API Status */}
        <button 
          onClick={() => window.open('http://localhost:5001/health', '_blank')}
          style={{
            background: 'rgba(72, 187, 120, 0.1)',
            color: '#22543d',
            border: '1px solid rgba(72, 187, 120, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            marginTop: '15px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(72, 187, 120, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(72, 187, 120, 0.1)';
          }}
        >
          ✅ API Status
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
