import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import { clearTexts, removeText } from '../../state/multitext';


const classes = makeStyles(theme => ({}));


function SelectedMultitextList(props) {
  const { clearTexts, removeText, selectedTexts } = props;

  const listItems = selectedTexts.map(item => {
    return (
      <ListItem
        key={item.object_id}
      >
        <Grid container>
          <Grid item xs={5}>
            <Typography color="textPrimary">
              {item.author}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography color="textPrimary">
              {item.title}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              color="primary"
              onClick={() => removeText(item)}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </ListItem>
    );
  });

  return (
    <div>
          <Typography
            color="textPrimary"
            variant="h5"
          >
            Multitext Targets
          { selectedTexts.length > 0 &&
            <IconButton
              color="default"
              onClick={clearTexts}
            >
              <CloseIcon />
            </IconButton>
          }
          </Typography>
      { selectedTexts.length > 0
        ? <List>
            {listItems}
          </List>
        : <div>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              No texts selected.
            </Typography>
          </div>
      }
    </div>
  );
}


SelectedMultitextList.propTypes = {
  clearTexts: PropTypes.func,
  removeText: PropTypes.func,
  selectedTexts: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      object_id: PropTypes.string,
      title: PropTypes.string
    })
  )
};


function mapStateToProps(state) {
  return {
    selectedTexts: state.multitext.selectedTexts
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      clearTexts: clearTexts,
      removeText: removeText
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(SelectedMultitextList);