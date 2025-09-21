import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const Dashboard = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalAchievements: 0,
    totalDistance: 0,
    totalTime: 0,
    thisWeek: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    type: 'running',
    name: '',
    value: '',
    unit: 'km',
    duration: '',
    notes: ''
  });
  const [userRole, setUserRole] = useState('USER');
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const fetchAchievements = async () => {
    setLoading(true);
    
    try {
      const data = await apiClient.get('/achievements');
      
      if (data.success) {
        const achievementsData = data.data?.data || [];
        setAchievements(achievementsData);
        
        // Calculate stats
        const totalAchievements = achievementsData.length;
        const totalDistance = achievementsData.reduce((sum, a) => sum + (a.value || 0), 0);
        const totalTime = achievementsData.reduce((sum, a) => sum + (a.duration || 0), 0);
        const thisWeek = achievementsData.filter(a => {
          const created = new Date(a.createdAt);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return created > weekAgo;
        }).length;
        
        setStats({ totalAchievements, totalDistance, totalTime, thisWeek });
        setMessage(''); // Clear any previous errors
        // Auto-hide success messages after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка соединения: ${error.message}`);
    }
    
    setLoading(false);
  };

  const addAchievement = async () => {
    // Validation
    if (!newAchievement.value || parseFloat(newAchievement.value) <= 0) {
      setMessage('❌ Пожалуйста, введите корректное значение');
      return;
    }
    
    try {
      const data = await apiClient.post('/achievements', {
        type: newAchievement.type,
        name: newAchievement.name || undefined,
        value: parseFloat(newAchievement.value),
        unit: newAchievement.unit,
          duration: newAchievement.duration ? parseInt(newAchievement.duration) : undefined,
        notes: newAchievement.notes || undefined
      });
      
      if (data.success) {
        setMessage('✅ Достижение добавлено!');
        setShowAddForm(false);
        setNewAchievement({
          type: 'running',
          name: '',
          value: '',
          unit: 'km',
          duration: '',
          notes: ''
        });
        fetchAchievements();
        // Auto-hide success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchAchievements();
    fetchUserProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  const navigateTo = (page: string) => {
    window.location.href = `/${page}`;
  };

  const fetchUserProfile = async () => {
    try {
      const data = await apiClient.get('/users/profile');
      if (data.success) {
        setUserRole(data.data.role || 'USER');
        setUserName(data.data.name || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };


  const getSportIcon = (type: string) => {
    switch (type) {
      case 'running': return '🏃‍♂️';
      case 'cycling': return '🚴‍♂️';
      case 'swimming': return '🏊‍♂️';
      default: return '🏆';
    }
  };

  const getSportColor = (type: string) => {
    switch (type) {
      case 'running': return '#ff6b6b';
      case 'cycling': return '#4ecdc4';
      case 'swimming': return '#45b7d1';
      default: return '#96ceb4';
    }
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
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                🏆 Sport Achievements
              </h1>
              <p style={{ color: '#718096', margin: 0, fontSize: '16px' }}>
                Отслеживайте свои спортивные достижения
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
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
                ➕ Добавить
              </button>
              <button 
                onClick={() => navigateTo('profile')}
                style={{
                  background: 'rgba(72, 187, 120, 0.1)',
                  color: '#22543d',
                  border: '1px solid rgba(72, 187, 120, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '10px',
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
                👤 Профиль
              </button>
                   <button 
                     onClick={() => navigateTo('friends')}
                     style={{
                       background: 'rgba(245, 101, 101, 0.1)',
                       color: '#e53e3e',
                       border: '1px solid rgba(245, 101, 101, 0.3)',
                       padding: '10px 20px',
                       borderRadius: '10px',
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
                     👥 Друзья
                   </button>
                   {userRole === 'ADMIN' && (
                     <button 
                       onClick={() => navigateTo('admin')}
                       style={{
                         background: 'rgba(168, 85, 247, 0.1)',
                         color: '#a855f7',
                         border: '1px solid rgba(168, 85, 247, 0.3)',
                         padding: '10px 20px',
                         borderRadius: '10px',
                         cursor: 'pointer',
                         fontSize: '14px',
                         fontWeight: '600',
                         transition: 'all 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.target.style.background = 'rgba(168, 85, 247, 0.2)';
                       }}
                       onMouseLeave={(e) => {
                         e.target.style.background = 'rgba(168, 85, 247, 0.1)';
                       }}
                     >
                       👑 Админ
                     </button>
                   )}
              <button 
                onClick={logout}
                style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#6b7280',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '10px',
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
                🚪 Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          {[
            { title: 'Всего достижений', value: stats.totalAchievements, icon: '🏆', color: '#667eea' },
            { title: 'Общая дистанция', value: `${stats.totalDistance.toFixed(1)} км`, icon: '📏', color: '#4ecdc4' },
            { title: 'Общее время', value: `${Math.floor(stats.totalTime / 60)}ч ${stats.totalTime % 60}м`, icon: '⏱️', color: '#f093fb' },
            { title: 'На этой неделе', value: stats.thisWeek, icon: '📅', color: '#ff6b6b' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              animation: `slideInUp 0.8s ease-out ${index * 0.1}s both`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#718096', margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>
                    {stat.title}
                  </p>
                  <p style={{ color: '#2d3748', margin: 0, fontSize: '28px', fontWeight: '700' }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Achievement Form */}
        {showAddForm && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            animation: 'slideInUp 0.5s ease-out'
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '25px', fontSize: '24px', fontWeight: '600' }}>
              ➕ Добавить новое достижение
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                  Тип спорта
                </label>
                <select
                  value={newAchievement.type}
                  onChange={(e) => setNewAchievement({...newAchievement, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <option value="running">🏃‍♂️ Бег</option>
                  <option value="cycling">🚴‍♂️ Велосипед</option>
                  <option value="swimming">🏊‍♂️ Плавание</option>
                  <option value="custom">🏆 Другое</option>
                </select>
              </div>

              {newAchievement.type === 'custom' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                    Название
                  </label>
                  <input
                    type="text"
                    placeholder="Название достижения"
                    value={newAchievement.name}
                    onChange={(e) => setNewAchievement({...newAchievement, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                  Значение
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newAchievement.value}
                  onChange={(e) => setNewAchievement({...newAchievement, value: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                  Единица измерения
                </label>
                <select
                  value={newAchievement.unit}
                  onChange={(e) => setNewAchievement({...newAchievement, unit: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <option value="km">км</option>
                  <option value="m">м</option>
                  <option value="min">мин</option>
                  <option value="reps">повторы</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                  Время (минуты)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newAchievement.duration}
                  onChange={(e) => setNewAchievement({...newAchievement, duration: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600' }}>
                  Заметки
                </label>
                <textarea
                  placeholder="Дополнительные заметки..."
                  value={newAchievement.notes}
                  onChange={(e) => setNewAchievement({...newAchievement, notes: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'all 0.3s ease',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <button 
                onClick={addAchievement}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
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
                onClick={() => setShowAddForm(false)}
                style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#6b7280',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
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
                ❌ Отмена
              </button>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {showWelcome && userName && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '16px',
            marginBottom: '30px',
            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
            animation: 'slideInUp 0.8s ease-out',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20px',
              fontSize: '120px',
              opacity: 0.1,
              transform: 'rotate(15deg)'
            }}>
              👋
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ 
                margin: '0 0 10px 0', 
                fontSize: '24px', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                👋 Добро пожаловать, {userName}!
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: '16px', 
                opacity: 0.9 
              }}>
                Рады видеть вас в Sport Achievements! Начните отслеживать свои спортивные достижения.
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
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '16px',
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

        {/* Message */}
        {message && (
          <div style={{
            background: message.includes('✅') ? 'rgba(72, 187, 120, 0.1)' : 
                      message.includes('❌') ? 'rgba(245, 101, 101, 0.1)' : 
                      'rgba(102, 126, 234, 0.1)',
            color: message.includes('✅') ? '#22543d' : 
                   message.includes('❌') ? '#742a2a' : 
                   '#4a5568',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: `1px solid ${message.includes('✅') ? 'rgba(72, 187, 120, 0.2)' : 
                               message.includes('❌') ? 'rgba(245, 101, 101, 0.2)' : 
                               'rgba(102, 126, 234, 0.2)'}`,
            animation: 'slideInUp 0.5s ease-out',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {message.includes('✅') && '✅'}
              {message.includes('❌') && '❌'}
              {message.includes('⏳') && '⏳'}
              {message.includes('🔄') && '🔄'}
              <span>{message}</span>
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {message.includes('Токен') && (
                <button
                  onClick={() => window.location.href = '/'}
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  }}
                >
                  🔄 Войти заново
                </button>
              )}
              <button
                onClick={() => setMessage('')}
                style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  color: '#6b7280',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
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
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          animation: 'slideInUp 0.8s ease-out 0.4s both'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#2d3748', margin: 0, fontSize: '24px', fontWeight: '600' }}>
              🏆 Ваши достижения
            </h2>
            <button 
              onClick={fetchAchievements}
              disabled={loading}
              style={{
                background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 5px 15px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? '⏳ Загрузка...' : '🔄 Обновить'}
            </button>
          </div>
          
          {achievements.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '20px' 
            }}>
              {achievements.map((achievement: any, index: number) => (
                <div key={achievement.id || index} style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: `linear-gradient(135deg, ${getSportColor(achievement.type)}, ${getSportColor(achievement.type)}dd)`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {getSportIcon(achievement.type)}
                    </div>
                    <div style={{ textAlign: 'right', color: '#718096', fontSize: '12px' }}>
                      {new Date(achievement.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    color: '#2d3748',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {achievement.type === 'custom' ? achievement.name : 
                     achievement.type === 'running' ? 'Бег' :
                     achievement.type === 'cycling' ? 'Велосипед' :
                     achievement.type === 'swimming' ? 'Плавание' : achievement.type}
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontSize: '14px' }}>Дистанция:</span>
                      <span style={{ color: '#2d3748', fontWeight: '600' }}>
                        {achievement.value} {achievement.unit}
                      </span>
                    </div>
                    {achievement.duration && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#718096', fontSize: '14px' }}>Время:</span>
                        <span style={{ color: '#2d3748', fontWeight: '600' }}>
                          {Math.floor(achievement.duration / 60)}ч {achievement.duration % 60}м
                        </span>
                      </div>
                    )}
                    {achievement.notes && (
                      <div style={{ 
                        marginTop: '10px', 
                        padding: '10px', 
                        background: 'rgba(102, 126, 234, 0.1)', 
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#4a5568'
                      }}>
                        💬 {achievement.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#718096'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏃‍♂️</div>
              <h3 style={{ color: '#4a5568', marginBottom: '10px', fontSize: '20px' }}>
                Пока нет достижений
              </h3>
              <p style={{ margin: 0, fontSize: '16px' }}>
                Начните добавлять свои спортивные достижения!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
