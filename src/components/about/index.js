import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import PageContainer from '../common/PageContainer';


const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: '#fdead1',
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      height: '90vh',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(3),
      padding: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      height: '100%'
    }
  }
}));


function About(props) {
  const { routes } = props;

  const classes = useStyles();

  return (
    <PageContainer
      routes={routes}
    >
      <Paper
        className={classes.paper}
      >
        <Grid container
          alignContent="flex-start"
          alignItems="flex-start"
          justify="center"
        >
          <Grid item xs={12}>
            <Typography align="center" variant='h4'>About</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">
              For more information, contact Dr. Neil Coffee (<a href="ncoffee@buffalo.edu">ncoffee@buffalo.edu</a>)
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </PageContainer>
  );
}


About.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * URL of the route.
       */
      link: PropTypes.string,

      /**
       * Display name of the route.
       */
      name: PropTypes.string,
    })
  )
}


export default About;