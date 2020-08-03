// Project files
import { Theme, makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme: Theme) => ({
  button: {
    marginTop: theme.spacing() * 4,
  },
}));

export default useStyle;