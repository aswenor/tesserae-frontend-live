import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import connect from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import ArrowDropDownIcon from '@material-ui/core/ArrowDropDown';
import GetAppIcon from '@material-ui/core/GetApp';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  }
}));


function DownloadButton(props) {
  const { downloadResults, searchID } = props;
  const classes = useStyles();
  const [ open, setOpen ] = useState(false);
  const anchor = useRef(null);

  const handleSelect = (label) => {
    setOpen(false);
    downloadResults(searchID, label.toLowerCase());
  };

  return (
    <div
      className={classes.root}
    >
      <Fab
        color="primary"
        onClick={(event) => setOpen(prev => !prev)}
        ref={anchor}
        size="large"
        variant="extended"
      >
        <GetAppIcon /> Download <Divider variant="vertical" /> <ArrowDropDownIcon />
      </Fab>
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
              <ClickAwayListener>
                <Menu
                  anchor={anchor}
                  id='download-menu'
                  keepMounted
                  onClose={() => setOpen(false)}
                >
                  <MenuItem
                    onClick={() => handleSelect('json')}
                  >
                    JSON
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSelect('csv')}
                  >
                    CSV
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSelect('tab')}
                  >
                    Tab-Separated
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSelect('xml')}
                  >
                    XML
                  </MenuItem>
                </Menu>
              </ClickAwayListener>
            </Paper>
          </Collapse>
        )}
      </Popper>
    </div>
  )
}


DownloadButton.propTypes = {
  downloadResults: PropTypes.func,
  searchID: PropTypes.string
}


function mapStateToProps(state) {
  return {
      searchID: state.search.searchID
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    downloadResults: downloadResults
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);