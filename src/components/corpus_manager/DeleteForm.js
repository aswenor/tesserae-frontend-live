import React, { useState } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux';
import { findIndex, differenceBy, intersectionBy } from 'lodash';

import makeStyles from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import DeleteFormTable from './DeleteFormTable';
import { deleteTexts } from '../../api/corpus';


const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));


function DeleteForm(props) {
  const { availableTexts } = props;
  const classes = useStyles();

  const [ selected, setSelected ] = useState([]);
  const [ leftTexts, setLeftTexts] = useState(availableTexts);
  const [ rightTexts, setRightTexts ] = useState([]);

  const leftSelected = intersectionBy(selected, leftTexts, 'object_id');
  const rightSelected = intersectionBy(selected, rightTexts, 'object_id');

  const handleSelect = (event) => () => {
    const checked = event.target.clicked;
    const value = event.target.value;

    if (checked) {
      setSelected([value, ...selected]);
    }
    else {
      setSelected(differenceBy(selected, [value], 'object_id'));
    }
  };

  const handleMoveAllRight = () => {
    setLeftTexts([]);
    setRightTexts(availableTexts);
  };

  const handleMoveSelectedRight = () => {
    const newLeft = differenceBy(leftTexts, leftSelected, 'object_id');
    const newSelected = differenceBy(selected, leftSelected);
    setLeftTexts(newLeft);
    setRightTexts([...rightTexts, ...leftSelected]);
    setSelected(newSelected);
  };

  const handleMoveSelectedLeft = () => {
    const newRight = differenceBy(rightTexts, rightSelected, 'object_id');
    const newSelected = differenceBy(selected, rightSelected);
    setLeftTexts([...leftTexts, ...rightSelected]);
    setRightTexts(newRight);
    setSelected(newSelected)
  };
  
  const handleMoveAllLeft = () => {
    setLeftTexts(availableTexts);
    setRightTexts([]);
  };

  return (
    <Grid container
      spacing={2}
    >
      <Grid item>
        <DeleteFormTable
          onSelect={handleSelect}
          selected={leftSelected}
          texts={leftTexts}
          title={"In Corpus"}
        />
      </Grid>
      <Grid item>
        <Button
          aria-label="move all right"
          className={classes.button}
          disabled={leftTexts.length === 0}
          onClick={handleMoveAllRight}
          size="small"
          variant="outlined"
        >
          ≫
        </Button>
        <Button
          aria-label="move selected right"
          className={classes.button}
          disabled={leftSelected.length === 0}
          onClick={handleMoveSelectedRight}
          size="small"
          variant="outlined"
        >
          &gt;
        </Button>
        <Button
          aria-label="move selected left"
          className={classes.button}
          disabled={rightSelected.length === 0}
          onClick={handleMoveSelectedLeft}
          size="small"
          variant="outlined"
        >
          &lt;
        </Button>
        <Button
          aria-label="move all left"
          className={classes.button}
          disabled={rightTexts.length === 0}
          onClick={handleMoveAllLeft}
          size="small"
          variant="outlined"
        >
          ≪
        </Button>
        <Fab
          disabled={rightTexts.length === 0}
          onClick={() => deleteTexts(rightTexts.map(x =>x.object_id))}
        >
          Delete
        </Fab>
      </Grid>
      <Grid item>
        <DeleteFormTable
          onSelect={handleSelect}
          selected={rightSelected}
          texts={rightTexts}
          title="To Be Removed"
        />
      </Grid>
    </Grid>
  );
}


DeleteForm.propTypes = {
  texts: PropTypes.arrayOf(
    PropTypes.shape(
      {
        object_id: PropTypes.string
      }
    )
  )
}


/**
 * Add redux store state to this component's props.
 * 
 * @param {object} state The global state of the application.
 * @returns {object} Members of the global state to provide as props.
 */
function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts
  }
}


// Do redux binding here.
export default connect(mapStateToProps)(DeleteForm);