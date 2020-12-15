import React from 'react'; 
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import TextSelectDropdowns from '../search/TextSelectDropdowns';
import TypeButtonGroup from '../multitext/TypeButtonGroup';
import YearSlider from '../common/YearSlider';


const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  spacer: {
    marginTop: '15px',
    width: '100%'
  }
}));


function CorpusFilter(props) {
  const { availableTexts, authorFilter, dateRangeFilter, language,
          setAuthorFilter, setDateRangeFilter, setTitleFilter,
          setTypeFilter, titleFilter, typeFilter } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.spacer}></div>
      <Typography variant="h5">Filter Corpus By</Typography>
      <div className={classes.spacer}></div>
      <TypeButtonGroup
        setTypeFilter={setTypeFilter}
        typeFilter={typeFilter}
      />
      <div className={classes.spacer}></div>
      <TextSelectDropdowns
        handleAuthorChange={setAuthorFilter}
        handleTitleChange={setTitleFilter}
        loading={availableTexts.length === 0}
        loadingText={`Loading ${language} corpus`}
        onOpen={() => {}}
        textList={availableTexts}
        selection={{author: authorFilter, title: titleFilter}}
      />
      <div className={classes.spacer}></div>
      {/* <YearSlider
        setYear={setDateRangeFilter}
        year={dateRangeFilter}
      /> */}
    </div>
  );
}


CorpusFilter.propTypes = {
  availableTexts: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      title: PropTypes.string
    })
  ),
  authorFilter: PropTypes.string,
  dateRangeFilter: PropTypes.arrayOf(PropTypes.number),
  setAuthorFilter: PropTypes.func,
  setDateRangeFilter: PropTypes.func,
  setTitleFilter: PropTypes.func,
  setTypeFilter: PropTypes.func,
  titleFilter: PropTypes.string,
  typeFilter: PropTypes.string
};


function mapStateToProps(state) {
  return {
    availableTexts: state.corpus.availableTexts,
    language: state.corpus.language
  };
}


export default connect(mapStateToProps)(CorpusFilter);