import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/admin/statistics');
      if (data.success) {
        setStats(data.data);
        setMessage('');
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/admin/users');
      if (data.success) {
        setUsers(data.data.users);
        setMessage('');
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
    setLoading(false);
  };

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/admin/achievements');
      if (data.success) {
        setAchievements(data.data.achievements);
        setMessage('');
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const data = await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (data.success) {
        setMessage('✅ Роль пользователя обновлена');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    try {
      const data = await apiClient.delete(`/admin/users/${userId}`);
      if (data.success) {
        setMessage('✅ Пользователь удален');
        fetchUsers();
        setTimeout(() => setMessage(''), 3000);
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
    window.location.href = '/dashboard';
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
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
                👑 Админская панель
              </h1>
              <p style={{ color: '#718096', margin: 0, fontSize: '16px' }}>
                Управление пользователями и системой
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

        {/* Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          animation: 'slideInUp 0.8s ease-out 0.2s both'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            {[
              { id: 'stats', label: '📊 Статистика', action: fetchStats },
              { id: 'users', label: '👥 Пользователи', action: fetchUsers },
              { id: 'achievements', label: '🏆 Достижения', action: fetchAchievements }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  tab.action();
                }}
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(107, 114, 128, 0.1)',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  border: activeTab === tab.id ? 'none' : '1px solid rgba(107, 114, 128, 0.3)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'rgba(107, 114, 128, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'stats' && stats && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
                📊 Общая статистика
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px' 
              }}>
                {[
                  { title: 'Всего пользователей', value: stats.totalUsers, icon: '👥', color: '#667eea' },
                  { title: 'Админов', value: stats.totalAdmins, icon: '👑', color: '#f093fb' },
                  { title: 'Всего достижений', value: stats.totalAchievements, icon: '🏆', color: '#4ecdc4' },
                  { title: 'Дружеских связей', value: stats.totalFriendships, icon: '🤝', color: '#ff6b6b' },
                  { title: 'Уведомлений', value: stats.totalNotifications, icon: '📨', color: '#96ceb4' },
                  { title: 'Новых пользователей (7 дней)', value: stats.recentUsers, icon: '📅', color: '#667eea' },
                  { title: 'Новых достижений (7 дней)', value: stats.recentAchievements, icon: '📈', color: '#f093fb' }
                ].map((stat, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    padding: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
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

              {stats.achievementsByType && (
                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ color: '#2d3748', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                    🏃‍♂️ Достижения по типам
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    {stats.achievementsByType.map((type, index) => (
                      <div key={index} style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        padding: '15px',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#4a5568', fontWeight: '600' }}>
                            {type.type === 'running' ? '🏃‍♂️ Бег' :
                             type.type === 'cycling' ? '🚴‍♂️ Велосипед' :
                             type.type === 'swimming' ? '🏊‍♂️ Плавание' :
                             type.type === 'custom' ? '🏆 Другое' : type.type}
                          </span>
                          <span style={{ color: '#667eea', fontWeight: '700', fontSize: '18px' }}>
                            {type._count.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
                👥 Управление пользователями
              </h3>
              
              {users.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
                  gap: '20px' 
                }}>
                  {users.map((user: any, index: number) => (
                    <div key={user.id} style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px',
                      padding: '25px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: user.role === 'ADMIN' ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          color: 'white',
                          fontWeight: '600',
                          marginRight: '15px'
                        }}>
                          {user.role === 'ADMIN' ? '👑' : user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ color: '#2d3748', margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>
                            {user.name}
                          </h4>
                          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gap: '8px', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#718096', fontSize: '14px' }}>Роль:</span>
                          <span style={{ 
                            color: user.role === 'ADMIN' ? '#e53e3e' : '#22543d', 
                            fontWeight: '600',
                            background: user.role === 'ADMIN' ? 'rgba(245, 101, 101, 0.1)' : 'rgba(72, 187, 120, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}>
                            {user.role}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#718096', fontSize: '14px' }}>Достижений:</span>
                          <span style={{ color: '#2d3748', fontWeight: '600' }}>
                            {user._count.achievements}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#718096', fontSize: '14px' }}>Друзей:</span>
                          <span style={{ color: '#2d3748', fontWeight: '600' }}>
                            {user._count.friendships1 + user._count.friendships2}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#718096', fontSize: '14px' }}>Регистрация:</span>
                          <span style={{ color: '#2d3748', fontWeight: '600' }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: 'rgba(255,255,255,0.8)'
                          }}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          style={{
                            background: 'rgba(245, 101, 101, 0.1)',
                            color: '#e53e3e',
                            border: '1px solid rgba(245, 101, 101, 0.3)',
                            padding: '8px 12px',
                            borderRadius: '8px',
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
                          🗑️
                        </button>
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
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                  <h3 style={{ color: '#4a5568', marginBottom: '10px', fontSize: '20px' }}>
                    Загрузка пользователей...
                  </h3>
                  <p style={{ margin: 0, fontSize: '16px' }}>
                    {loading ? 'Загружаем данные...' : 'Нажмите на вкладку "Пользователи" для загрузки'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
                🏆 Все достижения
              </h3>
              
              {achievements.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                  gap: '20px' 
                }}>
                  {achievements.map((achievement: any, index: number) => (
                    <div key={achievement.id} style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px',
                      padding: '25px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          color: 'white',
                          fontWeight: '600',
                          marginRight: '15px'
                        }}>
                          {achievement.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ color: '#2d3748', margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>
                            {achievement.user.name}
                          </h4>
                          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
                            {achievement.user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <h5 style={{ color: '#2d3748', margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>
                          {achievement.type === 'custom' ? achievement.name : 
                           achievement.type === 'running' ? '🏃‍♂️ Бег' :
                           achievement.type === 'cycling' ? '🚴‍♂️ Велосипед' :
                           achievement.type === 'swimming' ? '🏊‍♂️ Плавание' : achievement.type}
                        </h5>
                        
                        <div style={{ display: 'grid', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#718096', fontSize: '14px' }}>Значение:</span>
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
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#718096', fontSize: '14px' }}>Дата:</span>
                            <span style={{ color: '#2d3748', fontWeight: '600' }}>
                              {new Date(achievement.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

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
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
                  <h3 style={{ color: '#4a5568', marginBottom: '10px', fontSize: '20px' }}>
                    Загрузка достижений...
                  </h3>
                  <p style={{ margin: 0, fontSize: '16px' }}>
                    {loading ? 'Загружаем данные...' : 'Нажмите на вкладку "Достижения" для загрузки'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
