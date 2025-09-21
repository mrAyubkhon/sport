import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    
    try {
      const data = await apiClient.get('/friends');
      
      if (data.success) {
        setFriends(data.data || []);
        setMessage(''); // Clear any previous errors
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка соединения: ${error.message}`);
    }
    
    setLoading(false);
  };

  const fetchFriendRequests = async () => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch('http://localhost:5001/api/friends/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFriendRequests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`http://localhost:5001/api/friends/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        // For demo purposes, we'll show some mock users
        setSearchResults([
          { id: '2', name: 'Алексей Иванов', email: 'alex@example.com', achievementsCount: 45 },
          { id: '3', name: 'Мария Петрова', email: 'maria@example.com', achievementsCount: 32 },
          { id: '4', name: 'Дмитрий Сидоров', email: 'dmitry@example.com', achievementsCount: 28 }
        ]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch('http://localhost:5001/api/friends/requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Запрос в друзья отправлен!');
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`http://localhost:5001/api/friends/requests/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Запрос принят!');
        fetchFriends();
        fetchFriendRequests();
      } else {
        setMessage(`❌ Ошибка: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`http://localhost:5001/api/friends/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('❌ Запрос отклонен');
        fetchFriendRequests();
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
                👥 Друзья
              </h1>
              <p style={{ color: '#718096', margin: 0, fontSize: '16px' }}>
                Общайтесь с друзьями и отслеживайте их достижения
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
              { id: 'friends', label: '👥 Мои друзья', count: friends.length },
              { id: 'requests', label: '📨 Запросы', count: friendRequests.length },
              { id: 'search', label: '🔍 Поиск', count: 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(107, 114, 128, 0.1)',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  border: activeTab === tab.id ? 'none' : '1px solid rgba(107, 114, 128, 0.3)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
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
                {tab.count > 0 && (
                  <span style={{
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(107, 114, 128, 0.3)',
                    color: activeTab === tab.id ? 'white' : '#6b7280',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'friends' && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
                👥 Мои друзья ({friends.length})
              </h3>
              
              {friends.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '20px' 
                }}>
                  {friends.map((friend: any, index: number) => (
                    <div key={friend.id || index} style={{
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
                          {friend.name ? friend.name.charAt(0).toUpperCase() : '👤'}
                        </div>
                        <div>
                          <h4 style={{ color: '#2d3748', margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>
                            {friend.name || 'Неизвестный пользователь'}
                          </h4>
                          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
                            {friend.email || ''}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#718096', fontSize: '14px' }}>Достижений:</span>
                          <span style={{ color: '#2d3748', fontWeight: '600' }}>
                            {friend.achievementsCount || 0}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#718096', fontSize: '14px' }}>Друзья с:</span>
                          <span style={{ color: '#2d3748', fontWeight: '600' }}>
                            {friend.createdAt ? new Date(friend.createdAt).toLocaleDateString() : 'Неизвестно'}
                          </span>
                        </div>
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
                    Пока нет друзей
                  </h3>
                  <p style={{ margin: 0, fontSize: '16px' }}>
                    Найдите друзей и начните отслеживать их достижения!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
                📨 Запросы в друзья ({friendRequests.length})
              </h3>
              
              {friendRequests.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '20px' 
                }}>
                  {friendRequests.map((request: any, index: number) => (
                    <div key={request.id || index} style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '16px',
                      padding: '25px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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
                          {request.name ? request.name.charAt(0).toUpperCase() : '👤'}
                        </div>
                        <div>
                          <h4 style={{ color: '#2d3748', margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>
                            {request.name || 'Неизвестный пользователь'}
                          </h4>
                          <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>
                            {request.email || ''}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => acceptFriendRequest(request.id)}
                          style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            flex: 1,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          ✅ Принять
                        </button>
                        <button 
                          onClick={() => rejectFriendRequest(request.id)}
                          style={{
                            background: 'rgba(245, 101, 101, 0.1)',
                            color: '#e53e3e',
                            border: '1px solid rgba(245, 101, 101, 0.3)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            flex: 1,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(245, 101, 101, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(245, 101, 101, 0.1)';
                          }}
                        >
                          ❌ Отклонить
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
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📨</div>
                  <h3 style={{ color: '#4a5568', marginBottom: '10px', fontSize: '20px' }}>
                    Нет новых запросов
                  </h3>
                  <p style={{ margin: 0, fontSize: '16px' }}>
                    Новые запросы в друзья появятся здесь
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '25px', fontSize: '20px', fontWeight: '600' }}>
                🔍 Поиск друзей
              </h3>
              
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Поиск по имени или email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <button 
                    onClick={searchUsers}
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
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🔍 Найти
                  </button>
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#718096'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ color: '#4a5568', marginBottom: '10px', fontSize: '20px' }}>
                  Поиск пользователей
                </h3>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  Введите имя или email пользователя для поиска
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
