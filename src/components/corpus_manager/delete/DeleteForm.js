import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { differenceBy, find, intersectionBy } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';

import CorpusFilter from '../../common/CorpusFilter';
import DeleteFormModal from './DeleteFormModal';
import DeleteFormTable from './DeleteFormTable';
import { deleteTexts, fetchTexts } from '../../../api/corpus';


const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
  },
  paper: {
    backgroundColor: theme.palette.secondary.main,
    height: 230,
    overflow: 'auto',
    width: 200,
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));


function filterText(text, filter) {
  console.log(filter);

  let typeFilter = true;
  if (filter.type.toLowerCase() !== 'all') {
    const isProse = filter.type === 'prose';
    typeFilter = isProse === text.is_prose;
  }

  const authorFilter = (
    filter.author === '' ||
    text.author.toLowerCase().search(filter.author) >= 0);
  const titleFilter = (
    filter.title === '' ||
    text.title.toLowerCase().search(filter.title) >= 0);
  const yearFilter = (
    filter.year !== undefined &&
    text.year >= filter.year[0] || text.year <= filter.year[1]
  );

  console.log(typeFilter, authorFilter, titleFilter, yearFilter);

  return (typeFilter && authorFilter && titleFilter && yearFilter);
}


function DeleteForm(props) {
  const { asyncReady, availableTexts, deleteTexts,
          fetchTexts, language } = props;

  const classes = useStyles();

  const defaultFilter = {
    author: '',
    title: '',
    type: 'all',
    year: [-100000, 100000]
  };

  const [ selected, setSelected ] = useState([]);
  const [ leftTexts, setLeftTexts] = useState([]);
  const [ rightTexts, setRightTexts ] = useState([]);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ filter, setFilter ] = useState(defaultFilter);

  useEffect(() => {
    if (availableTexts.length === 0) {
      setFilter(defaultFilter);
      setLeftTexts(availableTexts);
    }
    else if (availableTexts.length > 0 && leftTexts.length === 0) {
      setLeftTexts(availableTexts);
    }
  }, [availableTexts, filter, leftTexts, setFilter, setLeftTexts]);

  const leftSelected = intersectionBy(selected, leftTexts, 'object_id');
  const rightSelected = intersectionBy(selected, rightTexts, 'object_id');

  if (language !== '' && availableTexts.length === 0) {
    fetchTexts(language, asyncReady);
  }

  const handleSelect = (checked, value) => {
    if (checked) {
      setSelected(prev => [value, ...prev]);
    }
    else {
      setSelected(prev => differenceBy(prev, [value], 'object_id'));
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

  const handleDelete = () => {
    deleteTexts(rightTexts.map(x => x.object_id));
    setModalOpen(false);
  };

  return (
    <div>
      <Grid container
        alignItems="flex-start"
        className={classes.root}
        justify="center"
        spacing={2}
      >
        <Grid item
          xs={4}
        >
          <DeleteFormTable
            onSelect={handleSelect}
            selected={leftSelected}
            texts={leftTexts}
            title={"In Corpus"}
          />
        </Grid>
        <Grid item
          xs={4}
        >
          <Grid container
            alignItems="center"
            direction="column"
            spacing={0}
          >
            <CorpusFilter
              authorFilter={filter.author}
              dateRangeFilter={filter.year}
              setAuthorFilter={(value) => setFilter(prev => ({...prev, author: value}))}
              setAuthorFilter={(value) => setFilter(prev => ({...prev, year: value}))}
              setAuthorFilter={(value) => setFilter(prev => ({...prev, title: value}))}
              setAuthorFilter={(value) => setFilter(prev => ({...prev, type: value}))}
              titleFilter={filter.title}
              typeFilter={filter.type}
            />
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
              aria-label="delete-texts"
              disabled={rightTexts.length === 0}
              onClick={() => deleteTexts(rightTexts.map(x =>x.object_id))}
              variant="extended"
            >
              Delete
            </Fab>
          </Grid>
        </Grid>
        <Grid item
          xs={4}
        >
          <DeleteFormTable
            onSelect={handleSelect}
            selected={rightSelected}
            texts={rightTexts}
            title="To Be Removed"
          />
        </Grid>
      </Grid>
      { modalOpen &&
        <DeleteFormModal
          deleteCount={rightTexts.length}
          handleClose={() => setModalOpen(false)}
          handleDelete={handleDelete}
          open={modalOpen}
        />
      }
    </div>
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
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteTexts: deleteTexts,
    fetchTexts: fetchTexts
  }, dispatch);
}


// Do redux binding here.
export default connect(mapStateToProps, mapDispatchToProps)(DeleteForm);