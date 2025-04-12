import React, { useState } from 'react';
import { Box } from '@mui/material';
import ProfileEditForm from './ProfileEditForm';
import CustomButton from '../../components/UI/CustomButton/index';
import { editUserProfileService } from '../../services/';
import './ProfileTabs.scss'; // Подключи SCSS стили для табов

const ProfileTabs = ({ userData, adsData, onOpenAdModal, handleDeleteAd }) => {
  const [activeTab, setActiveTab] = useState('ads');
  const [handleEditProfile, setHandleEditProfile] = useState(false);

  const openEditProfile = () => setHandleEditProfile(true);
  const closeEditProfile = () => setHandleEditProfile(false);

  const sendEditProfile = async (formData) => {
    const profile = await editUserProfileService(formData);
    console.log("Результат отправки профиля на сервер", profile);
    return profile;
  }

  // console.log(adsData, "adsData");
  // console.log(userData, "userData");

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
        {activeTab === 'about' && (
          <div className="profile-tabs__about">
            <h2>О себе</h2>
            <p>
              <strong>Имя:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            {userData.city && (
              <p>
                <strong>Город:</strong> {userData.city}
              </p>
            )}
            {userData.phoneNumber && (
              <p>
                <strong>Номер телефона:</strong> {userData.phoneNumber}
              </p>
            )}
            {userData.bio && (
              <p>
                <strong>О себе:</strong> {userData.bio}
              </p>
            )}
            {/* Кнопка для открытия модального окна изменения профиля */}
            {!handleEditProfile && <CustomButton onClick={openEditProfile} children={"Изменить профиль"} />}

            {handleEditProfile && (
              <ProfileEditForm
                userData={userData}
                onSubmit={(formData) => {
                  console.log('Обновить профиль с данными', formData);
                  sendEditProfile(formData);
                  closeEditProfile();
                }}
                onClose={closeEditProfile}
              />
            )}
          </div>
        )}
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