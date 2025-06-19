// src/pages/ModerationPanel.jsx
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
  { id: 3, title: 'Cardio Kickboxing', trainerName: 'Maria Smirnova', createdAt: '2025-05-30', status: 'approved', description: 'Интенсивная кардио-тренировка в стиле кикбоксинга.' },
  { id: 4, title: 'Pilates Basics', trainerName: 'Olga Fedorova', createdAt: '2025-05-28', status: 'rejected', description: 'Основы пилатеса для укрепления кора и гибкости.' },
];

const ModerationPanel = () => {
  const [ads] = useState(initialAds);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [modalAd, setModalAd] = useState(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);

  // Подгружаем Tailwind и ждём его загрузки
  useEffect(() => {
    loadTailwindScript().then(() => setStylesLoaded(true));
  }, []);

  // Показываем заглушку пока стили не загрузились
  if (!stylesLoaded) {
    return <div className="flex items-center justify-center h-screen">Загрузка стилей...</div>;
  }

  // Фильтрация объявлений
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase()) || ad.trainerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const matchesDate = !dateFilter || ad.createdAt === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Подсчет статистики
  const stats = { pending: 0, approved: 0, rejected: 0 };
  ads.forEach(ad => { stats[ad.status] = (stats[ad.status] || 0) + 1; });

  // Bulk actions
  const toggleSelectAll = () => {
    selectedIds.size === filteredAds.length
      ? setSelectedIds(new Set())
      : setSelectedIds(new Set(filteredAds.map(ad => ad.id)));
  };
  const toggleSelectOne = id => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };
  const bulkApprove = () => { alert(`Approve: ${[...selectedIds].join(', ')}`); setSelectedIds(new Set()); };
  const bulkReject = () => { alert(`Reject: ${[...selectedIds].join(', ')}`); setSelectedIds(new Set()); };

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

      {/* Заголовок и статистика */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Панель модерации</h1>
        <div className="flex space-x-4 text-sm text-gray-600">
          <div>Ожидающие: {stats.pending}</div>
          <div>Одобренные: {stats.approved}</div>
          <div>Отклонённые: {stats.rejected}</div>
        </div>
      </header>

      {/* Фильтры и bulk-actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <input type="text" placeholder="Поиск" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring">
            <option value="all">Все статусы</option>
            <option value="pending">Ожидающие</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклонённые</option>
          </select>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring" />
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <button onClick={bulkApprove} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">Принять всё</button>
              <button onClick={bulkReject} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">Отклонить всё</button>
            </div>
          )}
        </div>
      </div>

      {/* Таблица */}
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
                <td className="px-4 py-3 capitalize text-sm"><span className={`px-2 py-1 rounded-full text-white ${ad.status === 'pending' ? 'bg-yellow-500' : ad.status === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>{ad.status}</span></td>
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

      {/* Модал */}
      {modalAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <button onClick={() => setModalAd(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
            <h2 className="text-xl font-semibold mb-2">{modalAd.title}</h2>
            <p className="text-sm text-gray-600 mb-4">Тренер: {modalAd.trainerName} | {new Date(ad.createdAt).toLocaleDateString('ru-RU')}</p>
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
    </div>
  );
};

export default ModerationPanel;
