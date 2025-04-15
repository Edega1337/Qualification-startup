import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, InputAdornment } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import PhoneIcon from '@material-ui/icons/Phone';
import InfoIcon from '@material-ui/icons/Info';
import { signUpService } from '../../services/index';

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
}));

export default function SignUp() {
  const classes = useStyles();
  const navigate = useNavigate();

  const loginRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);
  const cityRef = useRef(null);
  const phoneRef = useRef(null);
  const bioRef = useRef(null);

  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      const dataObject = {
        email: emailRef.current.value,
        login: loginRef.current.value,
        password: passwordRef.current.value,
        name: nameRef.current.value,
        city: cityRef.current.value || null,
        phoneNumber: phoneRef.current.value || null,
        bio: bioRef.current.value || null,
      };
      try {
        await signUpService(dataObject);
        navigate("/login");
      } catch (err) {
        console.error(err);

        if (err.response && err.response.data) {
          const message = err.response.data.message;

          if (message.includes("login")) {
            setLoginError(true);
            setLoginErrorMessage("Такой логин уже используется");
          }

          if (message.includes("email")) {
            setEmailError(true);
            setEmailErrorMessage("Такая почта уже используется");
          }
        } else {
          alert("Произошла неизвестная ошибка. Попробуйте позже.");
        }
      }
    }
  };

  const validateInputs = () => {
    const login = loginRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;
    const city = cityRef.current.value;
    const phone = phoneRef.current.value;
    const bio = bioRef.current.value;

    let isValid = true;

    if (!login || login.length < 3) {
      setLoginError(true);
      setLoginErrorMessage('Введите логин (минимум 3 символа).');
      isValid = false;
    } else {
      setLoginError(false);
      setLoginErrorMessage('');
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Введите корректный email.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Пароль должен быть не короче 6 символов.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.trim().length < 2) {
      alert("Пожалуйста, укажите имя (минимум 2 символа).");
      isValid = false;
    }

    if (city && city.trim().length < 2) {
      alert("Город должен содержать минимум 2 символа.");
      isValid = false;
    }

    if (phone && !/^[\d+()\s-]{6,20}$/.test(phone)) {
      alert("Введите корректный номер телефона.");
      isValid = false;
    }

    if (bio && bio.length > 300) {
      alert("Описание должно быть не длиннее 300 символов.");
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.heading}>
        Регистрация
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
            type="email"
            id="email"
            name="email"
            label="Электронная почта"
            variant="outlined"
            inputRef={emailRef}
            error={emailError}
            helperText={emailError ? emailErrorMessage : ''}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
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

        <Box className={classes.formGroup}>
          <TextField
            type="text"
            id="name"
            name="name"
            label="Имя"
            variant="outlined"
            inputRef={nameRef}
            required
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
            type="text"
            id="city"
            name="city"
            label="Город (необязательно)"
            variant="outlined"
            inputRef={cityRef}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            label="Телефон (необязательно)"
            variant="outlined"
            inputRef={phoneRef}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className={classes.formGroup}>
          <TextField
            id="bio"
            name="bio"
            label="О себе (необязательно)"
            variant="outlined"
            inputRef={bioRef}
            multiline
            rows={3}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InfoIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button type="submit" variant="contained" className={classes.submitButton}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
