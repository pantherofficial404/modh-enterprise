// Libraries
import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

// Project files
import { View } from 'components';
import useStyle from './not-found.style';

const NotFoundPage: React.FC = () => {
  const classes = useStyle();
  return (
    <View flexGrow alignItems="center" justifyContent="center">
      <Typography variant="h4">Page not found</Typography>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        component={Link}
        to="/">
        Go to home
      </Button>
    </View>
  );
};

export default NotFoundPage;
