import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { getMyRoleRequest, postRoleRequest } from '../../../services/index';


export default function BecomeCoachButton() {
  const [status, setStatus] = useState(null); // 'pending' | 'rejected' | null
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMyRoleRequest()
      .then(res => {
        if (mounted) setStatus(res.data.status || null);
      })
      .catch(err => {

        if (mounted) setStatus(null);
      });
    return () => { mounted = false; };
  }, []);

  const handleClick = async () => {
    setLoading(true);
    try {
      const st = await postRoleRequest();
      setStatus(st);
    } catch (error) {
      // Если заявка уже существует, сервер может вернуть 400
      if (error.response && error.response.status === 400) {
        setStatus('pending');
      } else {
        console.error('Невозможно отправить заявку, попробуйте позже:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  let label = 'Стать тренером';
  let disabled = false;

  if (status === 'pending') {
    label = 'Заявка обрабатывается…';
    disabled = true;
  } else if (status === 'rejected') {
    label = 'Отправить новую заявку';
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} /> : null}
    >
      {label}
    </Button>
  );
}
