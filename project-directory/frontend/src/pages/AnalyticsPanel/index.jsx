// src/pages/AnalyticsPanel.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTraffic } from '../../hooks/useTraffic';
import { useRetention } from '../../hooks/useRetention';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  BarChart, Bar, LabelList, Label
} from 'recharts';

// Форматируем даты и убираем время
const formatDate = (isoString, periodType) => {
  const date = new Date(isoString);
  if (periodType === 'day') {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }
  return date.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
};

// Кастомный тултип для графиков
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-lg">
        <p className="text-xs text-gray-500">
          {formatDate(label, 'day')}
        </p>
        <p className="font-semibold text-gray-800">
          Зарегистрированных: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsPanel = () => {
  // DAU & MAU
  const { data: dauData = [], isLoading: dauLoading } = useTraffic('30d');
  const { data: mauData = [], isLoading: mauLoading } = useTraffic('6m');

  // Retention
  const [retentionDays, setRetentionDays] = useState(7);
  const { data: retentionData = [], isLoading: retentionLoading } = useRetention(retentionDays);

  // Общая загрузка
  if (dauLoading || mauLoading || retentionLoading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="text-gray-500">Загрузка аналитики…</div>
      </div>
    );
  }

  // Собираем retention по тем же датам, что DAU
  const filledRetentionData = (() => {
    const map = Object.fromEntries(
      retentionData.map(r => [r.cohort, r.retention])
    );
    return dauData.map(d => {
      const key = new Date(d.period).toISOString().split('T')[0];
      return {
        cohort: d.period,
        retention: map[key] ?? 0
      };
    });
  })();

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-16">
      {/* Навигация */}
      <nav className="mb-6 border-b border-gray-200">
        <NavLink
          to="/moderation"
          className={({ isActive }) =>
            isActive
              ? 'mr-4 px-4 py-2 -mb-px text-blue-600 border-b-2 border-blue-600'
              : 'mr-4 px-4 py-2 text-gray-600 hover:text-gray-800'
          }
        >
          Модерация
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive
              ? 'px-4 py-2 -mb-px text-blue-600 border-b-2 border-blue-600'
              : 'px-4 py-2 text-gray-600 hover:text-gray-800'
          }
        >
          Аналитика
        </NavLink>
      </nav>

      <h1 className="text-2xl font-bold text-gray-800">Аналитика зарегистрированных пользователей</h1>

      {/* DAU график */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          График ежедневно зарегистрированных пользователей, за последние 30 дней
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dauData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tickFormatter={label => formatDate(label, 'day')} stroke="#4B5563" />
            <YAxis stroke="#4B5563">
              <Label angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }}>
                Количество
              </Label>
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="value"
              name="Зарегистрированных"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            >
              <LabelList dataKey="value" position="top" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* MAU график */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          График ежемесячно зарегистрированных пользователей, за последние 6 месяцев
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={mauData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barSize={30}
            barGap={4}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tickFormatter={label => formatDate(label, 'month')} stroke="#4B5563" />
            <YAxis stroke="#4B5563">
              <Label angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }}>
                Количество
              </Label>
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="value" name="Зарегистрированных" fill="#10B981" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Retention график */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Retention-аналитика
        </h2>
        <div className="mb-4 flex space-x-4">
          {[1, 7, 30].map(day => (
            <button
              key={day}
              onClick={() => setRetentionDays(day)}
              className={`px-4 py-2 rounded ${retentionDays === day ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {day}-дневный
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={filledRetentionData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barSize={30}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cohort" tickFormatter={label => formatDate(label, 'day')} stroke="#4B5563" />
            <YAxis stroke="#4B5563" unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="retention" name="Retention %" fill="#F59E0B" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="retention" position="top" formatter={val => `${val}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default AnalyticsPanel;
