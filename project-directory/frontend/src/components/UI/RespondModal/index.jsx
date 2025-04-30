
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isSameDay, parseISO } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';

/**
 * Компонент модалки для отклика
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSubmit: ({ date: Date, message: string }) => void,
 *   availableDate: string, // ISO дата, например ad.date
 * }} props
 */
const RespondModal = ({ open, onClose, onSubmit, availableDate }) => {
  const parsedAvailable = parseISO(availableDate);
  const [selectedDate, setSelectedDate] = useState(parsedAvailable);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    onSubmit({ date: selectedDate, message });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Отклик на объявление</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Выберите дату"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            shouldDisableDate={(date) => !isSameDay(date, parsedAvailable)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
          <TextField
            label="Сообщение"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!message.trim()}>
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default RespondModal;