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
      {/* Premium animated background */}
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
      
      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'particle1 8s infinite ease-in-out'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50%',
        animation: 'particle2 12s infinite ease-in-out'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '30%',
        left: '20%',
        width: '3px',
        height: '3px',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '50%',
        animation: 'particle3 10s infinite ease-in-out'
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
        @keyframes particle1 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        @keyframes particle2 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50% { transform: translateY(-30px) translateX(-15px); opacity: 0.8; }
        }
        @keyframes particle3 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.8; }
          50% { transform: translateY(-25px) translateX(20px); opacity: 0.3; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(25px)',
        padding: '50px 40px',
        borderRadius: '24px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
        margin: '20px',
        animation: 'slideIn 0.8s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Premium gradient border */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '24px',
          padding: '2px',
          background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }} />
        
        {/* Inner content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
             {/* Premium Welcome Message */}
             {showWelcome && (
               <div style={{
                 background: 'linear-gradient(135deg, #667eea, #764ba2)',
                 color: 'white',
                 padding: '25px 30px',
                 borderRadius: '20px',
                 marginBottom: '35px',
                 boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                 animation: 'slideIn 0.8s ease-out, glow 3s ease-in-out infinite',
                 position: 'relative',
                 overflow: 'hidden'
               }}>
                 {/* Shimmer effect */}
                 <div style={{
                   position: 'absolute',
                   top: 0,
                   left: '-100%',
                   width: '100%',
                   height: '100%',
                   background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                   animation: 'shimmer 3s infinite'
                 }} />
                 
                 <div style={{
                   position: 'absolute',
                   top: '-40px',
                   right: '-15px',
                   fontSize: '100px',
                   opacity: 0.1,
                   transform: 'rotate(15deg)',
                   animation: 'pulse 2s infinite'
                 }}>
                   ✨
                 </div>
                 
                 <div style={{ position: 'relative', zIndex: 2 }}>
                   <h2 style={{ 
                     margin: '0 0 10px 0', 
                     fontSize: '22px', 
                     fontWeight: '800',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: '10px',
                     textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                   }}>
                     ✨ Добро пожаловать!
                   </h2>
                   <p style={{ 
                     margin: 0, 
                     fontSize: '15px', 
                     opacity: 0.95,
                     fontWeight: '500'
                   }}>
                     Войдите в свой аккаунт или создайте новый
                   </p>
                 </div>
                 
                 <button
                   onClick={() => setShowWelcome(false)}
                   style={{
                     position: 'absolute',
                     top: '15px',
                     right: '15px',
                     background: 'rgba(255, 255, 255, 0.2)',
                     border: 'none',
                     color: 'white',
                     width: '28px',
                     height: '28px',
                     borderRadius: '50%',
                     cursor: 'pointer',
                     fontSize: '16px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'all 0.3s ease',
                     backdropFilter: 'blur(10px)'
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                     e.target.style.transform = 'scale(1.1)';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                     e.target.style.transform = 'scale(1)';
                   }}
                 >
                   ✕
                 </button>
               </div>
             )}

             {/* Premium Logo and Title */}
             <div style={{ marginBottom: '45px' }}>
               <div style={{
                 width: '90px',
                 height: '90px',
                 background: 'linear-gradient(135deg, #667eea, #764ba2)',
                 borderRadius: '24px',
                 margin: '0 auto 25px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 fontSize: '36px',
                 animation: 'pulse 2s infinite',
                 boxShadow: '0 15px 30px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                 position: 'relative',
                 overflow: 'hidden'
               }}>
                 {/* Shimmer effect on logo */}
                 <div style={{
                   position: 'absolute',
                   top: 0,
                   left: '-100%',
                   width: '100%',
                   height: '100%',
                   background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                   animation: 'shimmer 4s infinite'
                 }} />
                 <span style={{ position: 'relative', zIndex: 1 }}>🏆</span>
               </div>
               
               <h1 style={{ 
                 color: '#2d3748', 
                 marginBottom: '12px',
                 fontSize: '32px',
                 fontWeight: '800',
                 background: 'linear-gradient(135deg, #667eea, #764ba2)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                 letterSpacing: '-0.5px'
               }}>
                 Sport Achievements
               </h1>
               
               <p style={{ 
                 color: '#718096', 
                 fontSize: '17px', 
                 margin: 0,
                 fontWeight: '500',
                 opacity: 0.8
               }}>
                 Отслеживайте свои спортивные достижения
               </p>
             </div>
        
        {/* Premium Form */}
        <div style={{ marginBottom: '35px' }}>
          <div style={{ position: 'relative', marginBottom: '25px' }}>
            <input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 24px',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                e.target.style.transform = 'translateY(0)';
              }}
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 60px 18px 24px',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                e.target.style.transform = 'translateY(0)';
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#667eea',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Premium Login Button */}
        <button 
          onClick={handleLogin}
          disabled={loading}
          style={{
            background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '18px 36px',
            borderRadius: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '17px',
            fontWeight: '700',
            width: '100%',
            marginBottom: '30px',
            transition: 'all 0.3s ease',
            transform: loading ? 'none' : 'translateY(0)',
            boxShadow: loading ? 'none' : '0 15px 35px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 20px 45px rgba(102, 126, 234, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
            }
          }}
        >
          {/* Shimmer effect */}
          {!loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 3s infinite'
            }} />
          )}
          
          <span style={{ position: 'relative', zIndex: 1 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Вход...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                🚀 Войти в аккаунт
              </span>
            )}
          </span>
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

        {/* Premium Register Section */}
        <div style={{ 
          background: 'rgba(102, 126, 234, 0.08)', 
          padding: '25px', 
          borderRadius: '16px',
          fontSize: '15px',
          border: '1px solid rgba(102, 126, 234, 0.15)',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
            borderRadius: '16px'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ 
              margin: '0 0 18px 0', 
              color: '#4a5568',
              fontWeight: '500',
              fontSize: '16px'
            }}>
              Нет аккаунта? Создайте новый!
            </p>
            <button 
              onClick={() => window.location.href = '/register'}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '14px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 25px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
              }}
            >
              {/* Shimmer effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 3s infinite'
              }} />
              
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                ✨ Создать аккаунт
              </span>
            </button>
          </div>
        </div>
        </div>
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
