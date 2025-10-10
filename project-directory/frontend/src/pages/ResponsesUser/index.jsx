import React, { useEffect, useState, useCallback } from 'react';
import UpSideBar from '../../components/UI/UpSideBar';
import { Link as RouterLink } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  getMyResponses,       // для клиента
  acceptResponse,
  rejectResponse,
} from '../../services/index';

// Функция для динамической загрузки Tailwind CSS через CDN
function loadTailwindScript() {
  return new Promise(resolve => {
    if (document.getElementById('tailwindcss-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'tailwindcss-script';
    script.src = 'https://cdn.tailwindcss.com';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

const MyResponses = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const accessToken = useStore(state => state.accessToken);
  const role = useStore(state => state.user?.role);

  // Подгружаем Tailwind CSS дополнительно через CDN
  useEffect(() => {
    loadTailwindScript().then(() => setStylesLoaded(true));
  }, []);

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
    if (stylesLoaded) fetchResponses();
  }, [fetchResponses, stylesLoaded]);

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

  // Пока Tailwind не загрузился – показываем заглушку
  if (!stylesLoaded) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <UpSideBar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">Загрузка стилей...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <UpSideBar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">Загрузка откликов…</p>
        </div>
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <UpSideBar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">У вас ещё нет откликов{role === 'coach' ? ' на ваши объявления' : ''}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UpSideBar />
      <div className="flex-grow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {role === 'coach' ? 'Отклики на мои объявления' : 'Мои отклики'}
        </h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(resp => (
            <div
              key={resp.response_id}
              className="bg-white rounded-2xl shadow p-6 flex flex-col"
            >
              <RouterLink to={`/ads/${resp.ad.ad_id}`} className="block mb-4">
                <div className="h-40 w-full overflow-hidden rounded-xl">
                  <img
                    src={
                      `http://localhost:4000/uploads/d2e0d7cc-923a-45b3-8e1d-bd25950b70f0.jpg`
                    }
                    alt={resp.ad.name}
                  />
                </div>
              </RouterLink>
              <div className="flex-grow">
                <RouterLink to={`/ads/${resp.ad.ad_id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                  {resp.ad.name}
                </RouterLink>
                <p className="text-sm text-blue-500 mt-1">{resp.ad.typeOfTrening}</p>
                <p className="text-gray-600 mt-3"><strong>Сообщение:</strong> {resp.message || '–'}</p>
                <p className="text-gray-600 mt-2 text-sm"><strong>Дата отклика:</strong> {new Date(resp.date).toLocaleString()}</p>
                <p className="mt-2">
                  <strong>Статус:</strong>{' '}
                  <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${resp.status === 'accepted' ? 'bg-green-500' : resp.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>{resp.status}</span>
                </p>
                {role === 'coach' && resp.status === 'rejected' && resp.comment && (
                  <p className="text-gray-600 mt-2"><strong>Комментарий:</strong> {resp.comment}</p>
                )}
              </div>
              {/* Добавленные кнопки-заглушки */}
              <div className="mt-4 flex space-x-2">
                <button
                  className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50"
                  disabled={processingIds.includes(resp.response_id)}
                >
                  Принять
                </button>
                <button
                  className="flex-1 py-2 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 disabled:opacity-50"
                  disabled={processingIds.includes(resp.response_id)}
                >
                  Отклонить
                </button>
              </div>

              {role === 'coach' && (
                <div className="mt-4 flex space-x-2">
                  <button
                    className="flex-1 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50"
                    onClick={() => handleAction(resp.response_id, 'accept')}
                    disabled={processingIds.includes(resp.response_id) || resp.status !== 'pending'}
                  >
                    {processingIds.includes(resp.response_id) ? '…' : 'Принять'}
                  </button>
                  <button
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50"
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
    </div>
  );
};

export default MyResponses;