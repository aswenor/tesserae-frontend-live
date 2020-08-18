import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  letterButton: {
    backgroundColor: theme.default,
    border: '0px solid black',
    height: '15px',
    width: '15px'
  }
}));


function AlphabetSelector(props) {
  const { filterLetter, selectFilterLetter } = props;

  const alphabetList = ['*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
                        'V', 'W', 'X', 'Y', 'Z'];

  const [ filterIdx, setFilterIdx ] = useState(alphabetList.findIndex(filterLetter));

  const handleSelect = (letter, idx) => {

  };

  const alphabetHeaders = alphabetList.map((item, idx) => {
    return (
      <ButtonBase
        key={item}
        onClick={() => selectFilterLetter(item)}
      >
        <span>
          <Typography>
            {item}
          </Typography>
        </span>
      </ButtonBase>
    );
  });

  return (
    <div>
      <Grid container

      >

      </Grid>
    </div>
  );
}


AlphabetSelector.propTypes = {

};


