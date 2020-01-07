import React from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import LabeledSelect from '../../common/LabeledSelect';

import { updateSearchParameters } from '../../../state_management/search';

const styles = {
  select: {
    marginTop: 10,
    marginLeft: '5%',
    width: '90%'
  }
};


function prepListItem(item) {
  return {
    label: item,
    value: item
  };
}


const dummyUnitTypes = ['line', 'phrase'];
const dummyFeatures = ['exact word', 'lemma', 'semantic', 'lemma + semantic', 'sound'];
const dummyStoplist = ['0', '10', '20', '30', '40', '50', '100', '150', '200'];
const dummyStoplistBasis = ['corpus', 'target', 'source', 'target + source'];
const dummyScoreBasis = ['stem', 'word'];
const dummyFrequencyBasis = ['corpus', 'texts'];
const dummyMaxDistance = ['None', '10 words', '20 words', '30 words', '40 words', '50 words'];
const dummyDistanceMetric = ['frequency', 'frequency-source', 'frequency-target', 'span', 'span-source', 'span-target'];
const dummyDropScoresBelow = ['No Cutoff', '3', '4', '5', '6', '7', '8', '9'];


class AdvancedOptionsGroup extends React.Component {
  handleChange = parameter => event => {
    this.props.dispatch(updateSearchParameters({ [parameter]: event.target.value }))
  }

  render() {
    const { unitType, feature, stoplist, stoplistBasis,
            scoreBasis, frequencyBasis, maxDistance,
            distanceMetric, dropScoresBelow, classes } = this.props;

    const unitTypesList = dummyUnitTypes.map(prepListItem);
    const featuresList = dummyFeatures.map(prepListItem);
    const stoplistList = dummyStoplist.map(prepListItem);
    const stoplistBasisList = dummyStoplistBasis.map(prepListItem);
    const scoreBasisList = dummyScoreBasis.map(prepListItem);
    const frequencyBasisList = dummyFrequencyBasis.map(prepListItem);
    const maxDistanceList = dummyMaxDistance.map(prepListItem);
    const distanceMetricList = dummyDistanceMetric.map(prepListItem);
    const dropScoresBelowList = dummyDropScoresBelow.map(prepListItem);

    return (
      <div>
        <Grid
          container
          spacing={2}
          justify="space-evenly"
        >

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('unitType')}
              helperText={'Compare lines of text or complete thoughts.'}
              options={unitTypesList}
              value={unitType}
            />
          </Grid>

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('feature')}
              helperText={'Select the feature to compare on.'}
              options={featuresList}
              value={feature}
            />
          </Grid>

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('stoplist')}
              helperText={'Set the size of the stoplist'}
              options={stoplistList}
              value={stoplist}
            />
          </Grid>
          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('stoplistBasis')}
              helperText={'Specify the source of stoplist frequencies.'}
              options={stoplistBasisList}
              value={stoplistBasis}
            />
          </Grid>

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('scoreBasis')}
              helperText={'Specify whether to measure scoring frequency by word or stem.'}
              options={scoreBasisList}
              value={scoreBasis}
            />
          </Grid>

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('frequencyBasis')}
              helperText={'Specify the source of scoring frequencies.'}
              options={frequencyBasisList}
              value={frequencyBasis}
            />
          </Grid>

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('maxDistance')}
              helperText={'Specify the maximum number of words between bigram tokens.'}
              options={maxDistanceList}
              value={maxDistance}
            />
          </Grid>

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('distanceMetric')}
              helperText={'Specify whether to base distance on porition or frequency.'}
              options={distanceMetricList}
              value={distanceMetric}
            />
          </Grid>

          <Grid item xs={12}>
            <LabeledSelect
              handleChange={this.handleChange('dropScoresBelow')}
              helperText={'Specify the minimum score to show.'}
              options={dropScoresBelowList}
              value={dropScoresBelow}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { unitType, feature, stoplist, stoplistBasis,
          scoreBasis, frequencyBasis, maxDistance,
          distanceMetric, dropScoresBelow } = state.searchParameters;
  return { unitType, feature, stoplist, stoplistBasis,
           scoreBasis, frequencyBasis, maxDistance,
           distanceMetric, dropScoresBelow };
}


export default connect(mapStateToProps)(withStyles(styles)(AdvancedOptionsGroup));
