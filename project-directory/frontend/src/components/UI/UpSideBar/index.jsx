import React from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../../../services/index';
import './style.scss'; // Импортируем SCSS

const UpSideBar = () => {
  const accessToken = localStorage.getItem('accessToken') || false;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/content';
  };

  return (
    <div className="upSideBar">
      <div className="toolbar">
        <div className="title">
          <h1>Тренировки.<span className="highlight">ТУТ</span></h1>
        </div>

        <div className="menu">
          <Link to="/" className="link">
            <i className="fas fa-home icon"></i> Главная
          </Link>

          {accessToken ? (
            <>
              <span className="link">
                <Link to="/profile" className="link">Привет, {getUserInfo()}!</Link> {/* Ссылка на профиль */}
                <Link to="/user/responses" className="link">Отклики</Link>
              </span>
              <button className="button" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link">Войти</Link>
              <Link to="/registration" className="link">Зарегистрироваться</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpSideBar;
