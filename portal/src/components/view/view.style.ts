// Libraries
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  flexGrow: {
    flex: 1,
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
}));

export default useStyles;