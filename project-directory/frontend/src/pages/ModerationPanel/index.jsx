import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Функция для динамической загрузки Tailwind через CDN-сценарий
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

const initialAds = [
  { id: 1, title: 'Morning Yoga', trainerName: 'Alice Ivanova', createdAt: '2025-06-01', status: 'pending', description: 'Утренняя йога для всех уровней — растяжка, дыхание и медитация.' },
  { id: 2, title: 'Strength Training', trainerName: 'Ivan Petrov', createdAt: '2025-06-02', status: 'pending', description: 'Силовые упражнения с гантелями и штангой для набора массы.' },
];

const initialTrainerApplications = [
  { id: 1, name: 'Sergey Volkov', email: 'sergey@example.com', createdAt: '2025-06-05', status: 'pending', message: 'Хочу стать тренером по кроссфиту. Опыт 5 лет.', comment: '' },
  { id: 2, name: 'Elena Petrova', email: 'elena@example.com', createdAt: '2025-06-04', status: 'pending', message: 'Сертифицированный инструктор йоги. Ищу работу.', comment: '' },
];

const ModerationPanel = () => {
  const [ads] = useState(initialAds);
  const [applications, setApplications] = useState(initialTrainerApplications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [modalAd, setModalAd] = useState(null);
  const [modalApp, setModalApp] = useState(null);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('ads');
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    loadTailwindScript().then(() => setStylesLoaded(true));
  }, []);

  if (!stylesLoaded) {
    return <div className="flex items-center justify-center h-screen">Загрузка стилей...</div>;
  }

  // Фильтрация объявлений
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase()) ||
      ad.trainerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const matchesDate = !dateFilter || ad.createdAt === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Фильтрация заявок
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDate = !dateFilter || app.createdAt === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Подсчет статистики
  const stats = {
    ads: { pending: 0, approved: 0, rejected: 0 },
    apps: { pending: 0, approved: 0, rejected: 0 }
  };

  ads.forEach(ad => { stats.ads[ad.status] = (stats.ads[ad.status] || 0) + 1; });
  applications.forEach(app => { stats.apps[app.status] = (stats.apps[app.status] || 0) + 1; });

  // Bulk actions
  const toggleSelectAll = () => {
    const items = activeTab === 'ads' ? filteredAds : filteredApplications;
    selectedIds.size === items.length
      ? setSelectedIds(new Set())
      : setSelectedIds(new Set(items.map(item => item.id)));
  };

  const toggleSelectOne = id => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const bulkApprove = () => {
    if (activeTab === 'ads') {
      alert(`Approve ads: ${[...selectedIds].join(', ')}`);
    } else {
      setApplications(applications.map(app =>
        selectedIds.has(app.id) ? { ...app, status: 'approved' } : app
      ));
    }
    setSelectedIds(new Set());
  };

  const bulkReject = () => {
    if (activeTab === 'ads') {
      alert(`Reject ads: ${[...selectedIds].join(', ')}`);
    } else {
      setApplications(applications.map(app =>
        selectedIds.has(app.id) ? { ...app, status: 'rejected' } : app
      ));
    }
    setSelectedIds(new Set());
  };

  const handleAppDecision = (id, decision) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, status: decision, comment: decision === 'rejected' ? comment : '' } : app
    ));
    setModalApp(null);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Навигация */}
      <nav className="mb-6 border-b border-gray-200">
        <NavLink to="/moderation" className={({ isActive }) =>
          isActive
            ? 'mr-4 px-4 py-2 -mb-px text-blue-600 border-b-2 border-blue-600'
            : 'mr-4 px-4 py-2 text-gray-600 hover:text-gray-800'
        }>Модерация</NavLink>
        <NavLink to="/analytics" className={({ isActive }) =>
          isActive
            ? 'px-4 py-2 -mb-px text-blue-600 border-b-2 border-blue-600'
            : 'px-4 py-2 text-gray-600 hover:text-gray-800'
        }>Аналитика</NavLink>
      </nav>

      {/* Заголовок и табы */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Панель модерации</h1>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 -mb-px ${activeTab === 'ads' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Объявления
            <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {ads.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('trainers')}
            className={`px-4 py-2 -mb-px ${activeTab === 'trainers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Заявки на тренерство
            <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
              {applications.length}
            </span>
          </button>
        </div>

        <div className="flex space-x-4 text-sm text-gray-600 mt-2">
          <div>Ожидающие: {activeTab === 'ads' ? stats.ads.pending : stats.apps.pending}</div>
          <div>Одобренные: {activeTab === 'ads' ? stats.ads.approved : stats.apps.approved}</div>
          <div>Отклонённые: {activeTab === 'ads' ? stats.ads.rejected : stats.apps.rejected}</div>
        </div>
      </header>

      {/* Фильтры и bulk-actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder={activeTab === 'ads' ? "Поиск по названию или тренеру" : "Поиск по имени или email"}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидающие</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклонённые</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring"
          />
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={bulkApprove}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                Принять всё
              </button>
              <button
                onClick={bulkReject}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                Отклонить всё
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Таблица (зависит от активной вкладки) */}
      {activeTab === 'ads' ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3"><input type="checkbox" checked={filteredAds.length > 0 && selectedIds.size === filteredAds.length} onChange={toggleSelectAll} /></th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Заголовок</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Тренер</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Дата</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Статус</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAds.length ? filteredAds.map(ad => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(ad.id)} onChange={() => toggleSelectOne(ad.id)} /></td>
                  <td className="px-4 py-3 text-gray-800">{ad.title}</td>
                  <td className="px-4 py-3 text-gray-600">{ad.trainerName}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(ad.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td className="px-4 py-3 capitalize text-sm">
                    <span className={`px-2 py-1 rounded-full text-white ${ad.status === 'pending' ? 'bg-yellow-500' : ad.status === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button onClick={() => setModalAd(ad)} className="text-blue-600 hover:underline text-sm">Подробнее</button>
                    {ad.status === 'pending' && (<>
                      <button onClick={() => alert(`Approve ${ad.id}`)} className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white">✓</button>
                      <button onClick={() => alert(`Reject ${ad.id}`)} className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white">✕</button>
                    </>)}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">Ничего не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3"><input type="checkbox" checked={filteredApplications.length > 0 && selectedIds.size === filteredApplications.length} onChange={toggleSelectAll} /></th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Имя</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Дата</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Статус</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.length ? filteredApplications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(app.id)} onChange={() => toggleSelectOne(app.id)} /></td>
                  <td className="px-4 py-3 text-gray-800">{app.name}</td>
                  <td className="px-4 py-3 text-gray-600">{app.email}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td className="px-4 py-3 capitalize text-sm">
                    <span className={`px-2 py-1 rounded-full text-white ${app.status === 'pending' ? 'bg-yellow-500' : app.status === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button onClick={() => setModalApp(app)} className="text-blue-600 hover:underline text-sm">Подробнее</button>
                    {app.status === 'pending' && (<>
                      <button onClick={() => handleAppDecision(app.id, 'approved')} className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white">✓</button>
                      <button onClick={() => setModalApp(app)} className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white">✕</button>
                    </>)}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">Ничего не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное окно для объявлений */}
      {modalAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <button onClick={() => setModalAd(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
            <h2 className="text-xl font-semibold mb-2">{modalAd.title}</h2>
            <p className="text-sm text-gray-600 mb-4">Тренер: {modalAd.trainerName} | {new Date(modalAd.createdAt).toLocaleDateString('ru-RU')}</p>
            <p className="text-gray-800 mb-4">{modalAd.description}</p>
            <div className="flex justify-end space-x-2">
              {modalAd.status === 'pending' && (<>
                <button onClick={() => { alert(`Approve ${modalAd.id}`); setModalAd(null); }} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Принять</button>
                <button onClick={() => { alert(`Reject ${modalAd.id}`); setModalAd(null); }} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">Отклонить</button>
              </>)}
              <button onClick={() => setModalAd(null)} className="px-4 py-2 rounded border hover:bg-gray-100">Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для заявок на тренерство */}
      {modalApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <button onClick={() => setModalApp(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
            <h2 className="text-xl font-semibold mb-2">Заявка от {modalApp.name}</h2>
            <p className="text-sm text-gray-600 mb-4">Email: {modalApp.email} | {new Date(modalApp.createdAt).toLocaleDateString('ru-RU')}</p>
            <div className="mb-4">
              <p className="font-medium text-gray-700 mb-1">Сообщение:</p>
              <p className="text-gray-800 bg-gray-50 p-3 rounded">{modalApp.message}</p>
            </div>

            {modalApp.status === 'pending' && (
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Комментарий (при отклонении):</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  rows="3"
                  placeholder="Укажите причину отклонения (необязательно)"
                />
              </div>
            )}

            {modalApp.comment && modalApp.status === 'rejected' && (
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-1">Комментарий модератора:</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded">{modalApp.comment}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              {modalApp.status === 'pending' && (<>
                <button
                  onClick={() => handleAppDecision(modalApp.id, 'approved')}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                >
                  Одобрить
                </button>
                <button
                  onClick={() => handleAppDecision(modalApp.id, 'rejected')}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Отклонить
                </button>
              </>)}
              <button
                onClick={() => setModalApp(null)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModerationPanel;