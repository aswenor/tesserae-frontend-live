/**
 * @fileoverview Custom expansion panels with a dense layout.
 * 
 * @author [Jeff Kinnison](https://github.com/jeffkinnison)
 * 
 * @requires NPM:@material-ui/core
 */
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';


/**
 * Custom styling to make ExpansionPanel layout more dense.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ExpansionPanel>
 *       <ExpansionPanelSummary>
 *         <p>Example summary text </p>
 *       </ExpansionPanelSummary>
 *       <ExpansionPanelDetails>
 *         <p>This is the interior text.</p>
 *       </ExpansionPanelDetails>
 *     </ExpansionPanel>
 *   );
 */
export const MarginlessExpansionPanel = withStyles(theme => ({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    backgroundColor: theme.palette.secondary.main,
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
}))(MuiExpansionPanel);


/**
 * Custom styling to make ExpansionPanelSummary layout more dense.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ExpansionPanel>
 *       <ExpansionPanelSummary>
 *         <p>Example summary text </p>
 *       </ExpansionPanelSummary>
 *       <ExpansionPanelDetails>
 *         <p>This is the interior text.</p>
 *       </ExpansionPanelDetails>
 *     </ExpansionPanel>
 *   );
 */
export const MarginlessExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);


/**
 * Custom styling to make ExpansionPanelSummary layout more dense.
 * 
 * @component
 * 
 * @example
 *   return (
 *     <ExpansionPanel>
 *       <ExpansionPanelSummary>
 *         <p>Example summary text </p>
 *       </ExpansionPanelSummary>
 *       <ExpansionPanelDetails>
 *         <p>This is the interior text.</p>
 *       </ExpansionPanelDetails>
 *     </ExpansionPanel>
 *   );
 */
export const MarginlessExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);