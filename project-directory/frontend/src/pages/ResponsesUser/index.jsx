// src/pages/ResponsesUser.jsx   (или MyResponses.jsx)
import React, { useEffect, useState } from 'react';
import UpSideBar from '../../components/UI/UpSideBar';
import { getMyResponses } from '../../services/index';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';     // ← импорт стора
import './style.scss';

const MyResponses = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // получаем токен из стора
  const accessToken = useStore(state => state.accessToken);

  useEffect(() => {
    console.log('[MyResponses] токен из стора:', accessToken);

    getMyResponses()
      .then(data => setList(data))
      .catch(err => {
        console.error('Ошибка при загрузке откликов:', err);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);  // ждём, пока токен станет доступен

  if (loading) return <p>Загрузка откликов…</p>;
  if (!list.length) return <p>У вас ещё нет откликов на ваши объявления</p>;

  return (
    <div className="container">
      <UpSideBar />
      <h1>Отклики на мои объявления</h1>
      <ul className="responses-list">
        {list.map(resp => (
          <li key={resp.response_id} className="response-item">
            <Link to={`/ads/${resp.ad.ad_id}`} className="response-item__ad">
              {resp.ad.name} ({resp.ad.typeOfTrening})
            </Link>
            <div className="response-item__user">
              <img
                src={resp.user.avatarUrl || '/default-avatar.png'}
                alt={resp.user.login}
                className="avatar"
              />
              <span>{resp.user.login}</span>
            </div>
            <div className="response-item__message">
              <strong>Сообщение:</strong> {resp.message || '–'}
            </div>
            <div className="response-item__date">
              <strong>Дата отклика:</strong> {new Date(resp.date).toLocaleString()}
            </div>
            <div className="response-item__status">
              <strong>Статус:</strong> {resp.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyResponses;
