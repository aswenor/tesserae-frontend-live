import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AdvancedOptionsGroup from '../AdvancesOptionsGroup'
import TextSelectGroup from '../TextSelectGroup';


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


function SearchParametersForm(props) {
  const classes = useStyles();

  return (
    <section>
      <ExpansionPanel>
        <ExpansionPanelSummary
          aria-controls="select-text-form"
          expandIcon={<ExpandMoreIcon />}
          id="select-text-header"
        >
          <Typography className={classes.heading}>
            Select Texts to Search
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TextSelectGroup />
          <TextSelectGroup />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          aria-controls="advanced-options-form"
          expandIcon={<ExpandMoreIcon />}
          id="advanced-options-header"
        >
          <Typography className={classes.heading}>
            Select Texts to Search
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AdvancedOptionsGroup />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </section>
  );
}


function mapStateToProps(state) {
  return {
    language: state.searchParameters.language,
    author: state.searchParameters.author
  };
}


export default connect(mapStateToProps)(Counter);
