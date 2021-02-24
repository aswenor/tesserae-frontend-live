import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { find } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { fetchFullText } from '../../api/corpus';
import { removeFullText } from '../../state/texts';
import LoadingText from './LoadingText';
import TextDisplay from './TextDisplay';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    maxHeight: '100%',
  },
  paper: {
    backgroundColor: theme.palette.secondary.main,
    display: 'block',
    height: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      marginLeft: '12.5%',
      width: '75%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  toolbar: {
    marginBottom: theme.spacing(2),
    width: '100%'
  }
}))

function TextReader(props) {
  const { asyncReady, fetchFullText, removeFullText, textData, textMetadata, textID } = props;

  const classes = useStyles();

  const [ needFetch, setNeedFetch ] = useState(textMetadata.is_prose !== undefined && textData.length === 0);

  if (needFetch) {
    setNeedFetch(false);
    (async () => {
      await fetchFullText(textID, 'line', asyncReady);
    })();
  }

  useEffect(() => {
    return () => removeFullText(textID);
  }, [removeFullText, textID]);

  return (
    <div className={classes.root}>
      { textData.length === 0
        ? <LoadingText />
        : <Paper className={classes.paper} component="div">
            <Box>
              <Toolbar
                className={classes.toolbar}
              >
                <Typography variant="h4" align="center">
                  {textMetadata.author} - {textMetadata.title}
                </Typography>
              </Toolbar>
            </Box>
            <Box
              height={'100%'}
              width={1}
            >
              <TextDisplay units={textData} />
            </Box>
          </Paper>
      }
    </div>
  );

}


function mapStateToProps(state, ownProps) {
  const textMetadata = find(state.corpus.availableTexts, x => x.object_id === ownProps.textID);
  return {
    asyncReady: state.async.asyncPending < state.async.maxAsyncPending,
    textData: state.texts[ownProps.textID] !== undefined ? state.texts[ownProps.textID] : [],
    textMetadata: textMetadata
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchFullText: fetchFullText,
    removeFullText: removeFullText
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TextReader);
