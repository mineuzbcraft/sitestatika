
import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert, Button, Typography, Space, Popconfirm } from 'antd';
import type { User } from 'firebase/auth';
import { getMajmualar, deleteMajmua, addMajmua } from '../utils/firestoreService';
import type { Majmua } from '../types';

const { Title } = Typography;

interface TizimJadvaliProps {
  user: User;
}

const TizimJadvali: React.FC<TizimJadvaliProps> = ({ user }) => {
  const [majmualar, setMajmualar] = useState<Majmua[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ma'lumotlarni yuklash funksiyasi
  const loadMajmualar = async () => {
    try {
      setLoading(true);
      const data = await getMajmualar(user.uid);
      setMajmualar(data);
      setError(null);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
      setError("Ma'lumotlarni yuklab bo'lmadi. Internet aloqasini tekshiring yoki keyinroq urinib ko'ring.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadMajmualar();
    }
  }, [user]);

  // Majmuani o'chirish
  const handleDelete = async (id: string) => {
    try {
      await deleteMajmua(id);
      // O'chirilgandan so'ng ro'yxatni yangilash
      setMajmualar(majmualar.filter(m => m.id !== id));
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
      setError("Majmuani o'chirib bo'lmadi.");
    }
  };
  
  // Test uchun yangi majmua qo'shish
  const handleAdd = async () => {
    try {
        await addMajmua("Yangi Majmua", "Yangi Mas'ul", "Yangi Izoh", user.uid);
        loadMajmualar(); // Ro'yxatni qayta yuklash
    } catch (err) {
        console.error("Qo'shishda xatolik:", err);
        setError("Yangi majmua qo'shib bo'lmadi.");
    }
  }

  // Jadval ustunlari (columns)
  const columns = [
    { title: 'T/R', dataIndex: 't_r', key: 't_r', width: 60 },
    { title: 'Majmua nomi', dataIndex: 'nomi', key: 'nomi' },
    { title: 'Mas\'ul shaxs', key: 'masul_shaxs', render: (_: any, record: Majmua) => record.masul_shaxs.ism },
    { title: 'Izoh', dataIndex: 'izoh', key: 'izoh' },
    { title: 'Holat', dataIndex: 'holat', key: 'holat' },
    { 
      title: 'Amallar', 
      key: 'action', 
      width: 120,
      render: (_: any, record: Majmua) => (
        <Space size="middle">
          <Button type="primary" size="small">Tahrir</Button>
          <Popconfirm 
            title="O'chirishga ishonchingiz komilmi?" 
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button type="primary" danger size="small">O'chir</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin tip="Ma'lumotlar yuklanmoqda..." size="large"><div style={{ padding: '50px' }} /></Spin>;
  }

  if (error) {
    return <Alert message="Xatolik" description={error} type="error" showIcon closable />;
  }

  return (
    <div>
        <Space style={{ marginBottom: 16 }}>
            <Title level={4}>Majmualar Ro'yxati</Title>
            <Button type="primary" onClick={handleAdd}>+ Yangi Majmua Qo'shish</Button>
        </Space>
        <Table 
            columns={columns} 
            dataSource={majmualar} 
            rowKey="id" 
            bordered
            pagination={false} // Hozircha sahifalashni o'chiramiz
        />
    </div>
  );
};

export default TizimJadvali;
