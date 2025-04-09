import React, { useState } from 'react';
import { Box } from '@mui/material';
import './ProfileTabs.scss'; // Подключи SCSS стили для табов

const ProfileTabs = ({ userData, adsData, onOpenAdModal, handleDeleteAd }) => {
  const [activeTab, setActiveTab] = useState('ads');
  console.log(adsData, "adsData");
  console.log(userData, "userData");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="profile-tabs">
      <div className="profile-tabs__buttons">
        <button
          className={`profile-tabs__button ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => handleTabClick('about')}
        >
          О себе
        </button>
        <button
          className={`profile-tabs__button ${activeTab === 'ads' ? 'active' : ''}`}
          onClick={() => handleTabClick('ads')}
        >
          Мои объявления
        </button>
      </div>
      <div className="profile-tabs__content">
        {activeTab === 'ads' && (
          <div className="profile-tabs__ads">
            <div className="profile-tabs__ads-header">
              <h2>Мои объявления</h2>
              <button
                className="profile-tabs__add-ad-button"
                onClick={onOpenAdModal}
              >
                Разместить объявление
              </button>
            </div>
            {adsData && adsData.length > 0 ? (
              <div className="ads-grid">
                {adsData.map((ad, index) => (
                  <Box key={ad.id || index} className="ads__card">
                    {ad.photo ? (
                      <img src={ad.photo} alt={ad.name} />
                    ) : (
                      <div className="ads__card-placeholder">
                        <span>Фото не загружено</span>
                      </div>
                    )}
                    <Box className="ads__card-content">
                      <h3>{ad.name}</h3>
                      <p>{ad.price} ₽ • {ad.city_ad}</p>
                      <p>{new Date(ad.date).toLocaleDateString()}</p>
                    </Box>
                    <button
                      className="ads__card-delete"
                      onClick={() => handleDeleteAd(ad.id)}
                      title="Удалить объявление"
                    >
                      Удалить
                    </button>
                  </Box>
                ))}
              </div>
            ) : (
              <p>Объявлений пока нет.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;