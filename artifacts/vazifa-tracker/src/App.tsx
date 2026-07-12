
import { useState, useEffect } from 'react';
import { auth } from './firebase-config';
import type { User } from 'firebase/auth';
import KirishOynasi from './components/KirishOynasi';
import TizimJadvali from './components/TizimJadvali';
import { Layout, Spin } from 'antd';

const { Header, Content, Footer } = Layout;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" tip="Autentifikatsiya tekshirilmoqda...">
            <div style={{ padding: '50px' }} />
        </Spin>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#001529' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          Vazifalar Nazorat Tizimi
        </div>
        {user && (
          <button 
            onClick={() => auth.signOut()} 
            style={{ color: 'white', background: '#1677ff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Chiqish
          </button>
        )}
      </Header>
      <Content style={{ padding: '0 48px', marginTop: '24px' }}>
        {user ? (
          <div className="site-layout-content" style={{ background: '#fff', padding: 24, borderRadius: '8px' }}>
            <TizimJadvali user={user} />
          </div>
        ) : (
          <KirishOynasi />
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        created by @Msrfteam
      </Footer>
    </Layout>
  );
}

export default App;
