import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    marginBottom: '25px'
  },
  innerBox: {
    paddingLeft: '20px'
  }
}));


function CollapseBox(props) {
  const { children, headerText } = props;

  const classes = useStyles();

  const [ open, setOpen ] = useState(false);

  const toggleOpen = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const icon = open ? (<ExpandLessIcon size="small" />) : (<ExpandMoreIcon size="small" />);

  return (
    <Box
      className={classes.root}
      flexGrow={1}
      justifyContent="center"
      width={1}
    >
      <Box
        onClick={toggleOpen}
      >
        <Typography
          variant="h6"
        >
          {icon}{headerText}
        </Typography>
      </Box>
      <Collapse in={open}>
        <Box
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          width={1}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}


CollapseBox.propTypes = {
  headerText: PropTypes.string
};


export default CollapseBox;