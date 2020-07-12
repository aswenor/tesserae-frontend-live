import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    height: '100%'
  }
}))


function FormSelector(props) {
  const { forms, onSelect, selected } = props;

  const classes = useStyles();

  const items = forms.map(item => {
    return (
      <ListItem button
        key={item.label.toLowerCase()}
        onClick={() => onSelect(item.label.toLowerCase())}
        selected={item.label.toLowerCase() === selected.toLowerCase()}
      >
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItem>
    );
  });

  return (
    <div
      className={classes.root}
    >
      <Toolbar>
        <Typography variant="h4">
          Corpus
        </Typography>
      </Toolbar>
      <List
        aria-label="corpus-management-menu"
        component="ul"
      >
        {items}
      </List>
    </div>
  );
}


FormSelector.propTypes = {
  /**
   * Metadata about the forms to display.
   */
  forms: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Material-UI icon to display next to the title.
       */
      icon: PropTypes.element,

      /**
       * Unique label to use in UI selection.
       */
      label: PropTypes.string,

      /**
       * Display title of the UI.
       */
      title: PropTypes.string
    })
  ),

  /**
   * Function to change which UI is selected.
   */
  onSelect: PropTypes.func,

  /**
   * The label of the currently selected UI.
   */
  selected:PropTypes.string
}


export default FormSelector;