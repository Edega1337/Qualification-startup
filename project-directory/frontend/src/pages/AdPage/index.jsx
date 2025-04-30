// src/components/AdDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import RespondModal from '../../components/UI/RespondModal';
import UpSideBar from '../../components/UI/UpSideBar';
import './style.scss';

const AdDetail = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAd() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/ads/${id}`);
        if (!res.ok) throw new Error('Ошибка при загрузке объявления');
        const json = await res.json();
        const data = json.ad || json;
        setAd(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleRespond = async ({ date, message }) => {
    try {
      const res = await fetch(`http://localhost:4000/ads/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date, message }),
      });
      if (res.status === 401) {
        alert('Пожалуйста, зарегистрируйтесь, чтобы откликнуться');
        handleCloseModal();
        return;
      }
      if (!res.ok) throw new Error('Ошибка при отправке отклика');
      alert('Спасибо, ваш отклик отправлен');
      handleCloseModal();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="adDetail adDetail--loading">
        <Skeleton variant="rectangular" width="100%" height={300} />
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={200} />
      </div>
    );
  }

  if (!ad) {
    return <p>Объявление не найдено</p>;
  }

  return (
    <div className="container">
      <UpSideBar />
      <div className="adDetail">
        <Link to="/ads" className="back-link">← Назад к списку</Link>
        <div className="image-wrapper">
          <img
            src={`http://localhost:4000/uploads/${ad.namePhoto}`}
            alt={ad.name}
            className="adDetail__image"
          />
        </div>
        <h1 className="adDetail__title">{ad.name}</h1>
        <div className="adDetail__price">{ad.price} ₽</div>
        <div className="adDetail__info">
          <p className="adDetail__description">{ad.description}</p>
          <p className="adDetail__meta">Тип тренировки: <strong>{ad.typeOfTrening}</strong></p>
          <p className="adDetail__meta">Дата: <strong>{new Date(ad.date).toLocaleDateString()}</strong></p>
          <p className="adDetail__meta">Город: <strong>{ad.city_ad}</strong></p>
        </div>
        <div className="adDetail__actions">
          <button className="respond-button" onClick={handleOpenModal}>
            Записаться
          </button>
        </div>
      </div>

      <RespondModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleRespond}
        availableDate={ad.date}
      />
    </div>
  );
};

export default AdDetail;
