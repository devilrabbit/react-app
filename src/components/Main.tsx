import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Header from './Header';
import SideBar from './SideBar';
import Content from './Content';

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

  const handleSideBarOpen = () => {
    setOpen(true);
  };
  const handleSideBarClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Header onSideBarOpen={handleSideBarOpen} />
      <SideBar open={open} onClose={handleSideBarClose} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Content />
      </main>
    </div>
  );
};

export default Main;
