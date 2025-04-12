import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Modal
} from '@mui/material';
import './style.scss'; // Здесь ваши глобальные SCSS-стили
import { useQuery } from '@tanstack/react-query';
import { currentUserService, sendAdService } from '../../services';
import UpSideBar from '../../components/UI/UpSideBar';
import UserInfo from '../Profile/UserInfo';
import TrainerAdForm from '../AdForm';
import ProfileTabs from './ProfileTabs'; // Импортируем наш компонент переключателя

const ProfilePage = () => {
  const [openAdModal, setOpenAdModal] = useState(false); // Для модального окна объявления
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации

  // Функции для управления модальными окнами
  const handleOpenAdModal = () => setOpenAdModal(true);
  const handleCloseAdModal = () => setOpenAdModal(false);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });

  // Эффект для автоматического скрытия уведомления
  useEffect(() => {
    if (notification.open) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, open: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Запрос данных профиля пользователя
  const getProfile = async () => {
    try {
      const result = await currentUserService();
      console.log("Результат получения профиля пользователя.", result);
      setIsAuthenticated(true);
      return result;
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
      throw err;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  const sendUserAdForm = async (formData) => {
    try {
      const result = await sendAdService(formData);
      console.log('Результат отправления', result);
      setNotification({
        open: true,
        message: 'Ваше объявление успешно размещено и находится на рассмотрении.',
      });
      handleCloseAdModal();
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setNotification({
        open: true,
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.',
      });
    }
  };

  // Обработчик удаления объявления (пока просто вывод в консоль)
  const handleDeleteAd = (adId) => {
    console.log("Удалить объявление с id", adId);
  };

  return (
    <>
      <UpSideBar />
      {!isAuthenticated ? (
        <div className="non-auth">
          <Paper className="non-auth__paper">
            <Typography variant="h5" className="non-auth__heading">
              Вы не авторизованы
            </Typography>
            <Typography variant="body1" className="non-auth__text">
              Пожалуйста, авторизуйтесь, чтобы получить доступ к вашему профилю.
            </Typography>
            <Button variant="contained" color="primary" href="/login">
              Войти
            </Button>
          </Paper>
        </div>
      ) : (
        <div className="content">
          <div className="content__profile">
            <UserInfo userData={data} />
          </div>
          <div className="content__switch">
            {/* Интегрируем ProfileTabs. Он переключает вкладки "О себе" и "Мои объявления" */}
            <ProfileTabs
              userData={data}
              adsData={data.ads}
              onOpenAdModal={handleOpenAdModal}
              handleDeleteAd={handleDeleteAd}
            />
          </div>
          <Modal open={openAdModal} onClose={handleCloseAdModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 3,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <TrainerAdForm onSubmit={sendUserAdForm} onClose={handleCloseAdModal} />

            </Box>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
