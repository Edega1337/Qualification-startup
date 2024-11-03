import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, InputAdornment } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import { logInService } from '../../services/index';
import { useStore } from '../../store/useStore';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: theme.spacing(3),
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: theme.spacing(2),
  },
  errorMessage: {
    color: theme.palette.error.main,
    fontSize: '0.85rem',
    marginTop: theme.spacing(0.5),
  },
  submitButton: {
    width: '100%',
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  forgotPassword: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    textAlign: 'center',
    fontSize: '0.9rem',
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 'bold',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setAccessToken } = useStore((state) => ({
    setAccessToken: state.setAccessToken,
  }))

  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      const dataObject = {
        login: loginRef.current.value,
        password: passwordRef.current.value,
      }
      try {
        const result = await logInService(dataObject);
        setAccessToken(result.accessToken);
        navigate("/");
      } catch (err) {
        console.err;
      }
    }
  };

  const validateInputs = () => {
    const login = loginRef.current.value;
    const password = passwordRef.current.value;
    let isValid = true;

    if (!login || login.length < 3) {
      setLoginError(true);
      setLoginErrorMessage('Please enter a valid login (at least 3 characters).');
      isValid = false;
    } else {
      setLoginError(false);
      setLoginErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.heading}>
        Вход
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box className={classes.formGroup}>
          <TextField
            type="text"
            id="login"
            name="login"
            label="Логин"
            variant="outlined"
            inputRef={loginRef}
            error={loginError}
            helperText={loginError ? loginErrorMessage : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            type="password"
            id="password"
            name="password"
            label="Пароль"
            variant="outlined"
            inputRef={passwordRef}
            error={passwordError}
            helperText={passwordError ? passwordErrorMessage : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button type="submit" variant="contained" className={classes.submitButton}>
          Войти
        </Button>

        <Typography className={classes.forgotPassword}>
          <a href="#">Забыли пароль?</a>
        </Typography>
      </form>
    </div>
  );
}
