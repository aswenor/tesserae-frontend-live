import React from 'react';

import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  hrBox: {
    display: props => {console.log(props); return props.width > 0 ? 'flow-root' : 'hidden'},
    height: '100%',
    width: props => props.width,
    minWidth: props => props.width > 0 ? props.minWidth : 0,
    overflowX: 'auto',
    overflowY: 'auto',
  },
});


function ResizeBox(props) {
  const { component, children } = props;
  const classes = useStyles(props);
  return (
    <Box
      component={component}
      className={classes.hrBox}
    >
      {children}
    </Box>
  );
}

export default ResizeBox;
