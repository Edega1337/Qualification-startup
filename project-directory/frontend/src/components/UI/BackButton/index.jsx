// src/components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
  const navigate = useNavigate();

  // Функция для перехода на предыдущую страницу
  const handleBack = () => {
    if (window.history.length > 2) { // Проверка наличия истории, чтобы избежать перехода на пустую страницу
      navigate(-1); // Возвращает на предыдущую страницу
    } else {
      navigate('/'); // Переход на главную страницу, если истории нет
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<ArrowBackIcon />}
      onClick={handleBack}
      sx={{ mb: 2 }} // отступ внизу, чтобы не мешала другим элементам
    >
      Назад
    </Button>
  );
};

export default BackButton;
