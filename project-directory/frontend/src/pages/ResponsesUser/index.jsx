import { useEffect, useState, useCallback } from 'react';
import UpSideBar from '../../components/UI/UpSideBar';
import { Link as RouterLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import './style.scss';
import {
  getMyResponses,       // для клиента
  acceptResponse,
  rejectResponse,
} from '../../services/index';

const MyResponses = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]);
  const accessToken = useStore(state => state.accessToken);
  const role = useStore(state => state.user?.role);

  const fetchResponses = useCallback(() => {
    if (!accessToken) return;
    setLoading(true);
    const fetcher = role === 'coach' ? getOwnerResponses : getMyResponses;
    fetcher()
      .then(data => setList(data))
      .catch(err => console.error('Ошибка при загрузке откликов:', err))
      .finally(() => setLoading(false));
  }, [accessToken, role]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const handleAction = async (responseId, action) => {
    setProcessingIds(ids => [...ids, responseId]);
    try {
      if (action === 'accept') await acceptResponse(responseId);
      else await rejectResponse(responseId);
      fetchResponses();
    } catch (err) {
      console.error(`Не удалось ${action} отклик:`, err);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== responseId));
    }
  };

  if (loading) return (
    <div className="container responses-user"><UpSideBar /><p>Загрузка откликов…</p></div>
  );

  if (!list.length) return (
    <div className="container responses-user"><UpSideBar /><p>У вас ещё нет откликов{role === 'coach' ? ' на ваши объявления' : ''}</p></div>
  );

  return (
    <div className="container responses-user">
      <UpSideBar />
      <h1 className="responses-user__title">{role === 'coach' ? 'Отклики на мои объявления' : 'Мои отклики'}</h1>
      <div className="responses-grid">
        {list.map(resp =>
        (
          <div key={resp.response_id} className="response-card">
            <RouterLink to={`/ads/${resp.ad.ad_id}`} className="response-card__img-link">
              <div className="response-card__img-wrapper">
                <img
                  src={
                    resp.ad
                      ? 'http://localhost:4000/uploads/6f495276-ea0e-4d31-bca7-98a2cc7462e4.png'
                      : 'http://localhost:4000/default-ad.png'
                  }
                  alt={resp.ad.name}
                  className="response-card__img"
                />
              </div>
            </RouterLink>
            <div className="response-card__info">
              <RouterLink to={`/ads/${resp.ad.ad_id}`} className="response-card__name">
                {resp.ad.name}
              </RouterLink>
              <span className="response-card__type">{resp.ad.typeOfTrening}</span>
              <p className="response-card__message"><strong>Сообщение:</strong> {resp.message || '–'}</p>
              <p className="response-card__meta"><strong>Дата отклика:</strong> {new Date(resp.date).toLocaleString()}</p>
              <p className="response-card__meta"><strong>Статус:</strong> <span className={`badge badge--${resp.status}`}>{resp.status}</span></p>
              {role === 'coach' && resp.status === 'rejected' && resp.comment && (
                <p className="response-card__comment"><strong>Комментарий:</strong> {resp.comment}</p>
              )}
            </div>
            {role === 'coach' && (
              <div className="response-card__actions">
                <button
                  className="btn btn--accept"
                  onClick={() => handleAction(resp.response_id, 'accept')}
                  disabled={processingIds.includes(resp.response_id) || resp.status !== 'pending'}
                >
                  {processingIds.includes(resp.response_id) ? '…' : 'Принять'}
                </button>
                <button
                  className="btn btn--reject"
                  onClick={() => handleAction(resp.response_id, 'reject')}
                  disabled={processingIds.includes(resp.response_id) || resp.status !== 'pending'}
                >
                  {processingIds.includes(resp.response_id) ? '…' : 'Отклонить'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResponses;
