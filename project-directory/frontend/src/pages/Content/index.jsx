import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UpSideBar from '../../components/UI/UpSideBar';
import SearchBar from './SearchBar';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(10),
    display: 'flex',
  },
  adsContainer: {
    flex: 1,
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  adCard: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  media: {
    height: 140,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stickySearchBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[3],
    borderRadius: '4px',
    marginBottom: theme.spacing(2),
  },
  recommendationsTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  recommendationsContainer: {
    display: 'flex',
    overflowX: 'auto',
    paddingBottom: theme.spacing(2),
  },
  recommendationCard: {
    width: 200,
    marginRight: theme.spacing(2),
    flexShrink: 0,
  },
  price: {
    color: theme.palette.secondary.main,
  },
}));

const AdList = ({
  ads = [
    {
      title: "Продается велосипед",
      description: "В отличном состоянии, практически новый.",
      price: 15000,
      image: "https://example.com/your-image-url.jpg",
    },
    {
      title: "Классные наушники",
      description: "Наушники с шумоподавлением, практически не использовались.",
      price: 5000,
      image: "https://example.com/your-image-url2.jpg",
    },
  ],
  recommendations = [
    {
      title: "Беспроводные наушники beats solo 3",
      price: "3100 ₽",
      image: "https://example.com/your-image-url.jpg",
    },
    {
      title: "Куртка alpha industries N-2B",
      price: "7900 ₽",
      image: "https://example.com/your-image-url2.jpg",
    },
    {
      title: "Наушники beats studio 3 wireless",
      price: "5000 ₽",
      image: "https://example.com/your-image-url3.jpg",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image: "https://example.com/your-image-url4.jpg",
    },
  ],
}) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <UpSideBar />
      <div className={classes.adsContainer}>

        {/* Sticky SearchBar */}
        <Box className={classes.stickySearchBar}>
          <SearchBar />
        </Box>

        {/* Recommendations Title */}
        <Typography variant="h5" className={classes.recommendationsTitle}>
          Рекомендации для вас
        </Typography>


        {/* Ad List */}
        <Grid container spacing={4}>
          {ads.map((ad, index) => (
            <Grid item xs={12} key={index}>
              <Card className={classes.adCard} elevation={3}>
                <CardMedia
                  className={classes.media}
                  image={ad.image}
                  title={ad.title}
                />
                <CardContent>
                  <Typography variant="h6" className={classes.title}>
                    {ad.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ad.description}
                  </Typography>
                  <Typography variant="h6" className={classes.price}>
                    {ad.price} Р
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Подробнее
                  </Button>
                  <Button size="small" color="secondary">
                    Связаться
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};

export default AdList;
