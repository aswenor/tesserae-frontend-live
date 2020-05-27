import React, { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import ColorLensIcon from '@material-ui/icons/ColorLens';


const useStyles = makeStyles(theme => ({
  button: {
    background: '#ffffff',
    border: '1px solid #000000',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
    marginLeft: '10px'
  }
}));


const palettes = [
  {palette: {primary: '#4d4a77', secondary: '#dbdbe4', name: 'Purple'}},
  {palette: {primary: '#432e47', secondary: '#d9d5da', name: 'Wine'}},
  {palette: {primary: '#be1b28', secondary: '#f2d1d4', name: 'Red'}},
  {palette: {primary: '#153159', secondary: '#d0d6de', name: 'Blue'}},
  {palette: {primary: '#5c6b68', secondary: '#dce1e1', name: 'Green'}},
  {palette: {primary: '#f69417', secondary: '#fdead1', name: 'Yellow'}},
  {palette: {primary: '#f55828', secondary: '#fdded4', name: 'Orange'}},
]


function PaletteSwapper(props) {
  const { updateTheme } = props;

  const classes = useStyles();

  const anchorRef = useRef(null);

  const [ open, setOpen ] = useState(false);
  const [ selectedIdx, setSelectedIdx ] = useState(6);

  const handleSelect = (palette, idx) => {
    setSelectedIdx(idx);
    setOpen(false);
    updateTheme(palette);
  };

  /** Close the dropdown popper. */
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  /** Toggle the dropdown popper open or closed. */
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuItems = palettes.map((item, idx) => {
    return (
      <MenuItem
        key={`${item.palette.primary}-${item.palette.secondary}`}
        onClick={() => handleSelect(item, idx)}
        selected={idx == selectedIdx}
        style={{backgroundColor: item.palette.primary, height: '50px', borderBottom: '2px solid black'}}
      >
      </MenuItem>
    );
  });

  return (
    <div>
      <IconButton
        className={classes.button}
        color="primary"
        onClick={handleToggle}
        ref={anchorRef}
        size='medium'
      >
        <ColorLensIcon />
      </IconButton>
      <Popper
        anchorEl={anchorRef.current}
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
            <Paper styles={{padding: 0, border: '1px solid black'}}>
              <ClickAwayListener
                onClickAway={handleClose}
              >
                <MenuList
                  id="additional-languages-menu"
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


export default PaletteSwapper;