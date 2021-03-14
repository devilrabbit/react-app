import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Header from './Header';
import SideBar from './SideBar';
import Content from './Content';
import AddJobDialog from './AddJobDialog';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

const Main: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSideBarOpen = () => {
    setOpen(true);
  };
  const handleSideBarClose = () => {
    setOpen(false);
  };
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className={classes.root}>
      <Header open={open} onSideBarOpen={handleSideBarOpen} />
      <SideBar open={open} onClose={handleSideBarClose} onOpenAddDialog={handleDialogOpen} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Content />
      </main>
      <AddJobDialog open={dialogOpen} onClose={handleDialogClose} />
    </div>
  );
};

export default Main;
