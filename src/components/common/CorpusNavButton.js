/**
 * @fileoverview Navigation dropdown menu for corpus management.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @requires NPM:react
 * @requires NPM:prop-types
 * @requires NPM:react-router
 * @requires NPM:@material-ui/core
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  button: {
    background: '#ffffff',
    border: '1px solid #000000',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
  },
}));


/**
 * Navigation dropdown menu.
 * 
 * @component
 * @example
 *   import DeleteIcon from '@material-ui/icons/Delete';
 *   import EditIcon from '@material-ui/icons/Edit';
 *   import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
 *   import PublishIcon from '@material-ui/icons/Publish';
 *   
 *   const routes = [
 *    {icon: <LibraryBooksIcon />, link: '/corpus', name: 'View the Corpus'},
 *    {icon: <PublishIcon />, link: '/corpus/ingest', name: 'Ingest a Text'},
 *    {icon: <EditIcon />, link: '/corpus/edit', name: 'Edit Text Metadata'},
 *    {icon: <DeleteIcon />, link: '/corpus/delete', name: 'Delete a Text'},
 *   ];
 *   
 *   return <CorpusNavButton buttonText="Corpus" routes={routes} />
 */
function CorpusNavButton(props) {
  const { buttonText, routes } = props;

  const classes = useStyles();

  const [ open, setOpen ] = useState(false);
  const anchor = useRef(null);

  const menuItems = routes.map((item) => {
    return (
      <MenuItem
        component={Link}
        key={item.link}
        to={item.link}
      >
        {item.icon} {item.name}
      </MenuItem>
    );
  });

  return (
    <div className={classes.root}>
      <Button
        className={classes.button}
        color="default"
        onClick={(event) => setOpen(prev => !prev)}
        ref={anchor}
        size="small"
      >
        {buttonText}<ArrowDropDownIcon />
      </Button>
      <Popper
        anchorEl={anchor.current}
        disablePortal
        open={open}
        role={undefined}
        transition
      >
        {({ TransitionProps, placement }) => (
          <Collapse
            {...TransitionProps}
            style={{
              transformOrigin: 'center bottom'
            }}
          >
            <Paper>
              <ClickAwayListener
                onClickAway={() => setOpen(false)}
              >
                <MenuList
                  anchor={anchor}
                  id='download-menu'
                  open={Boolean(anchor)}
                >
                  {menuItems}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Collapse>
        )}
      </Popper>
    </div>
  );
}


CorpusNavButton.propTypes = {
  /**
   * Name to display on the dropdown button.
   */
  buttonText: PropTypes.string,

  /**
   * Array of routes to corpus management pages.
   */
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Material-UI Icon to display next to the name.
       */
      icon: PropTypes.element,

      /**
       * Relative URL of the page to display.
       */
      link: PropTypes.string,

      /**
       * Display name of the link.
       */
      name: PropTypes.string
    })
  )
}


export default CorpusNavButton;