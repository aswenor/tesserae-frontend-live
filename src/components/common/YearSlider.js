import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isArray, maxBy, minBy, range, zip } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        marginTop: '40px',
        width: '97%'
    }
}));


function YearSlider(props) {
    const { maxYear, minYear, setYear, year } = props;

    const classes = useStyles();

    const firstTick = Math.floor(minYear / 100) * 100;
    const lastTick = Math.ceil(maxYear / 100) * 100;

    const createLabelText = (value) => (
        value > 0 
        ? `${Math.abs(value)} C.E.`
        : `${Math.abs(value)} B.C.E.`
    );

    return (
        <Slider
            aria-labelledby="select date slider"
            className={classes.root}
            getAriaValueText={createLabelText}
            marks
            onChange={(event, value) => {console.log(value); setYear(value)}}
            min={firstTick}
            max={lastTick}
            onChangeCommitted={(event, value) => {console.log(value); setYear(value)}}
            step={100}
            value={year}
            valueLabelDisplay="on"
            valueLabelFormat={createLabelText}
        />
    );
}


YearSlider.propTypes = {
    /**
     * Maximum allowable year. Automatically detected from corpus.
     */
    maxYear: PropTypes.number,

    /**
     * Minimum allowable year. Automatically detected from corpus.
     */
    minYear: PropTypes.number,

    /**
     * Function to update the selected year.
     */
    setYear: PropTypes.func,

    /**
     * The currently selected year. If an array, displays as a range of years.
     */
    year: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.number)
    ])
}


function mapStateToProps(state) {
    const maxYear = maxBy(state.corpus.availableTexts, 'year');
    const minYear = minBy(state.corpus.availableTexts, 'year');
    return {
        maxYear: maxYear ? maxYear.year : 1000000,
        minYear: minYear ? minYear.year : -1000000
    }
}


export default connect(mapStateToProps)(YearSlider);