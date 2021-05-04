import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
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
import ImageIcon from '@material-ui/icons/Image';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import { Collapse } from '@material-ui/core';
import { Job } from '@src/models/Job';
import { selectJob } from '@src/stores/jobs';

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
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
);

type SideBarProps = {
  open: boolean;
  onClose: () => void;
  onOpenAddDialog: () => void;
};

const SideBar: React.FC<SideBarProps> = (props: SideBarProps) => {
  const classes = useStyles();
  const [previewOpen, setPreviewOpen] = useState(true);

  const jobs = useSelector((state: RootStateOrAny) => state.jobs.jobs);
  const selectedJob = useSelector((state: RootStateOrAny) => state.jobs.selectedJob);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedJob) {
      history.push(`/jobs/${selectedJob.id}`);
    }
  }, [selectedJob]);

  const handleDrawerClose = useCallback(() => {
    props.onClose();
  }, [props]);
  const handlePreviewClick = () => {
    setPreviewOpen(!previewOpen);
  };
  const handleJobClick = (job: Job) => {
    dispatch(selectJob(job));
  };
  const handleAddClick = useCallback(() => {
    props.onOpenAddDialog();
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
        <ListItem button key={'shops'} component={Link} to="./shops">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={'Shops'} />
        </ListItem>
        <ListItem button key={'users'} component={Link} to="./users">
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={'Users'} />
        </ListItem>
        <ListItem button key={'preview'} onClick={handlePreviewClick}>
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary={'Preview'} />
          {previewOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={previewOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {jobs.map((job: Job) => {
              return (
                <ListItem
                  key={job.id}
                  button
                  onClick={() => handleJobClick(job)}
                  className={classes.nested}
                >
                  <ListItemText primary={job.name} />
                </ListItem>
              );
            })}
            <ListItem button className={classes.nested} onClick={handleAddClick}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default SideBar;
