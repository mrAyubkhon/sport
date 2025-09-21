import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    bio: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    
    try {
      const data = await apiClient.get('/users/profile');
      
      if (data.success) {
        setUser(data.data);
        setUserData({
          name: data.data.name || '',
          email: data.data.email || '',
          age: data.data.age?.toString() || '',
          weight: data.data.weight?.toString() || '',
          height: data.data.height?.toString() || '',
          bio: data.data.bio || ''
        });
        setMessage(''); // Clear any previous errors
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка соединения: ${error.message}`);
    }
    
    setLoading(false);
  };

  const updateProfile = async () => {
    try {
      const data = await apiClient.put('/users/profile', {
        name: userData.name,
        age: userData.age ? parseInt(userData.age) : undefined,
        weight: userData.weight ? parseFloat(userData.weight) : undefined,
        height: userData.height ? parseFloat(userData.height) : undefined,
        bio: userData.bio
      });
      
      if (data.success) {
        setMessage('✅ Профиль обновлен!');
        setUser(data.data);
        setEditing(false);
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  const goToDashboard = () => {
    window.location.href = '/';
  };

  const calculateBMI = () => {
    if (user?.weight && user?.height) {
      const heightInMeters = user.height / 100;
      return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <style>{`
        @keyframes slideInUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          animation: 'slideInUp 0.8s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                color: '#2d3748', 
                margin: '0 0 10px 0',
                fontSize: '32px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                👤 Профиль пользователя
              </h1>
              <p style={{ color: '#718096', margin: 0, fontSize: '16px' }}>
                Управляйте своими данными
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={goToDashboard}
                style={{
                  background: 'rgba(72, 187, 120, 0.1)',
                  color: '#22543d',
                  border: '1px solid rgba(72, 187, 120, 0.3)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(72, 187, 120, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(72, 187, 120, 0.1)';
                }}
              >
                🏠 Dashboard
              </button>
              <button 
                onClick={logout}
                style={{
                  background: 'rgba(245, 101, 101, 0.1)',
                  color: '#e53e3e',
                  border: '1px solid rgba(245, 101, 101, 0.3)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(245, 101, 101, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(245, 101, 101, 0.1)';
                }}
              >
                🚪 Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: message.includes('✅') ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
            color: message.includes('✅') ? '#22543d' : '#742a2a',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: `1px solid ${message.includes('✅') ? 'rgba(72, 187, 120, 0.2)' : 'rgba(245, 101, 101, 0.2)'}`,
            animation: 'slideInUp 0.5s ease-out'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Profile Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            animation: 'slideInUp 0.8s ease-out 0.2s both'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                animation: 'pulse 2s infinite'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h2 style={{ color: '#2d3748', margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600' }}>
                {user?.name || 'Загрузка...'}
              </h2>
              <p style={{ color: '#718096', margin: 0, fontSize: '16px' }}>
                {user?.email || ''}
              </p>
            </div>

            {!editing ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#4a5568', margin: '0 0 15px 0', fontSize: '18px', fontWeight: '600' }}>
                    📋 Информация о профиле
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096' }}>Возраст:</span>
                      <span style={{ color: '#2d3748', fontWeight: '600' }}>
                        {user?.age ? `${user.age} лет` : 'Не указан'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096' }}>Вес:</span>
                      <span style={{ color: '#2d3748', fontWeight: '600' }}>
                        {user?.weight ? `${user.weight} кг` : 'Не указан'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096' }}>Рост:</span>
                      <span style={{ color: '#2d3748', fontWeight: '600' }}>
                        {user?.height ? `${user.height} см` : 'Не указан'}
                      </span>
                    </div>
                    {calculateBMI() && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096' }}>ИМТ:</span>
                        <span style={{ color: '#2d3748', fontWeight: '600' }}>
                          {calculateBMI()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {user?.bio && (
                  <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#4a5568', margin: '0 0 15px 0', fontSize: '18px', fontWeight: '600' }}>
                      📝 О себе
                    </h3>
                    <div style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      padding: '15px',
                      borderRadius: '12px',
                      color: '#4a5568',
                      lineHeight: '1.6'
                    }}>
                      {user.bio}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setEditing(true)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  ✏️ Редактировать профиль
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ color: '#4a5568', margin: '0 0 25px 0', fontSize: '18px', fontWeight: '600' }}>
                  ✏️ Редактирование профиля
                </h3>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                      Имя
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        background: 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                        Возраст
                      </label>
                      <input
                        type="number"
                        value={userData.age}
                        onChange={(e) => setUserData({...userData, age: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '16px',
                          background: 'rgba(255,255,255,0.8)',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                        Вес (кг)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={userData.weight}
                        onChange={(e) => setUserData({...userData, weight: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '16px',
                          background: 'rgba(255,255,255,0.8)',
                          transition: 'all 0.3s ease',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                      Рост (см)
                    </label>
                    <input
                      type="number"
                      value={userData.height}
                      onChange={(e) => setUserData({...userData, height: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        background: 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                      О себе
                    </label>
                    <textarea
                      value={userData.bio}
                      onChange={(e) => setUserData({...userData, bio: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        background: 'rgba(255,255,255,0.8)',
                        transition: 'all 0.3s ease',
                        resize: 'vertical',
                        minHeight: '100px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                  <button 
                    onClick={updateProfile}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      flex: 1,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    ✅ Сохранить
                  </button>
                  <button 
                    onClick={() => setEditing(false)}
                    style={{
                      background: 'rgba(107, 114, 128, 0.1)',
                      color: '#6b7280',
                      border: '1px solid rgba(107, 114, 128, 0.3)',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      flex: 1,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(107, 114, 128, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                    }}
                  >
                    ❌ Отмена
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            animation: 'slideInUp 0.8s ease-out 0.4s both'
          }}>
            <h3 style={{ color: '#4a5568', margin: '0 0 25px 0', fontSize: '18px', fontWeight: '600' }}>
              📊 Статистика
            </h3>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#4a5568', fontWeight: '600' }}>Дата регистрации</span>
                  <span style={{ fontSize: '20px' }}>📅</span>
                </div>
                <p style={{ color: '#2d3748', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Неизвестно'}
                </p>
              </div>

              <div style={{
                background: 'rgba(72, 187, 120, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(72, 187, 120, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#4a5568', fontWeight: '600' }}>Статус аккаунта</span>
                  <span style={{ fontSize: '20px' }}>✅</span>
                </div>
                <p style={{ color: '#2d3748', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  Активен
                </p>
              </div>

              <div style={{
                background: 'rgba(245, 101, 101, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(245, 101, 101, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#4a5568', fontWeight: '600' }}>Последнее обновление</span>
                  <span style={{ fontSize: '20px' }}>🕒</span>
                </div>
                <p style={{ color: '#2d3748', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Никогда'}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h4 style={{ color: '#4a5568', margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>
                🎯 Цели на этот месяц
              </h4>
              <div style={{
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <p style={{ color: '#4a5568', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  Установите свои цели и отслеживайте прогресс в достижении спортивных результатов!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
