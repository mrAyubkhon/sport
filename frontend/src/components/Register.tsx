import React, { useState } from 'react';
import apiClient from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('❌ Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age ? parseInt(formData.age) : undefined,
          bio: formData.bio || undefined
        }),
      });
      
      const data = await response.json();

      if (data.success) {
        setMessage('✅ Аккаунт создан успешно! Перенаправляем на страницу входа...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }

    setLoading(false);
  };

  const goToLogin = () => {
    window.location.href = '/';
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
      overflow: 'hidden',
      padding: '20px'
    }}>
      <style>{`
        @keyframes slideIn {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Animated background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'pulse 20s infinite linear'
      }} />

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '50px 40px',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
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
              🎉
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
                🎉 Добро пожаловать!
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                opacity: 0.9 
              }}>
                Создайте аккаунт и начните отслеживать свои достижения
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
            Создание аккаунта
          </h1>
          <p style={{ color: '#718096', fontSize: '16px', margin: 0 }}>
            Присоединяйтесь к спортивному сообществу
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
              Имя *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Введите ваше имя"
              value={formData.name}
              onChange={handleChange}
              required
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              placeholder="Введите email"
              value={formData.email}
              onChange={handleChange}
              required
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
              Пароль *
            </label>
            <input
              type="password"
              name="password"
              placeholder="Минимум 6 символов"
              value={formData.password}
              onChange={handleChange}
              required
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
              Подтвердите пароль *
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Повторите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
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

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
              Возраст
            </label>
            <input
              type="number"
              name="age"
              placeholder="Ваш возраст"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
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

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
              О себе
            </label>
            <textarea
              name="bio"
              placeholder="Расскажите о своих спортивных интересах..."
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: '15px 20px',
              borderRadius: '12px',
              background: message.includes('✅') ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
              color: message.includes('✅') ? '#22543d' : '#742a2a',
              marginBottom: '25px',
              border: `1px solid ${message.includes('✅') ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)'}`,
              animation: 'slideIn 0.3s ease-out'
            }}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
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
            {loading ? '⏳ Создание аккаунта...' : '✅ Создать аккаунт'}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ 
          background: 'rgba(102, 126, 234, 0.1)', 
          padding: '20px', 
          borderRadius: '12px',
          fontSize: '14px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 15px 0', color: '#4a5568' }}>
            Уже есть аккаунт?
          </p>
          <button 
            onClick={goToLogin}
            style={{
              background: 'rgba(107, 114, 128, 0.1)',
              color: '#6b7280',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.1)';
            }}
          >
            🔐 Войти в аккаунт
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
