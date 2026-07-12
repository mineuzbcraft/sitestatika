
import { useState } from 'react';
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, Input, Button, Form, Alert, Typography } from 'antd';

const { Title } = Typography;

const KirishOynasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // Kirish muvaffaqiyatli, App.tsx avtomatik tarzda sahifani yangilaydi
    } catch (err: any) {
      console.error("Kirishda xatolik:", err);
      if (err.code === 'auth/invalid-credential') {
        setError("Login yoki parol noto'g'ri. Iltimos, tekshirib qayta urinib ko'ring.");
      } else {
        setError("Kirishda noma'lum xatolik yuz berdi.");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}>
      <Card 
        title={<Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>Tizimga kirish</Title>} 
        style={{ width: 400, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}
      >
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 20 }} onClose={() => setError(null)} />}
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Elektron pochta"
            name="email"
            initialValue="admin@msrfteam.com" // Qulaylik uchun
            rules={[{ required: true, type: 'email', message: 'Iltimos, elektron pochtangizni kiriting!' }]}
          >
            <Input placeholder="masalan, user@example.com" />
          </Form.Item>

          <Form.Item
            label="Parol"
            name="password"
            initialValue="msrfteam777" // Qulaylik uchun
            rules={[{ required: true, message: 'Iltimos, parolingizni kiriting!' }]}
          >
            <Input.Password placeholder="Parolingiz" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default KirishOynasi;
