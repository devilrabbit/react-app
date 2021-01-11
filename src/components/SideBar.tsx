import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
  }),
);

type SideBarProps = {
  open: boolean;
  onClose: () => void;
};

const SideBar: React.FC<SideBarProps> = (props: SideBarProps) => {
  const classes = useStyles();

  const handleDrawerClose = useCallback(() => {
    props.onClose();
  }, [props]);

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={props.open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button key={'customers'} component={Link} to="/customers">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={'Customers'} />
        </ListItem>
        <ListItem button key={'users'} component={Link} to="/users">
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={'Users'} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideBar;
