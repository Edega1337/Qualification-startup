import { Button } from '@mui/material';

const CustomButton = ({ children, onClick, ...props }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      sx={{
        padding: '0.6rem 1.2rem',
        borderRadius: '4px',
        fontSize: '1rem',
        textTransform: 'none', // сохраняем текст как есть
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: '#1565c0',
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;