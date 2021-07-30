import React from 'react';
import {
  makeStyles,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
} from '@openmsupply-client/common';

import clsx from 'clsx';

import { Link, useMatch } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
}));

interface ListItemLinkProps {
  to: string;
  icon: JSX.Element;
  text?: string;
}

const ListItemLink: React.FC<ListItemLinkProps> = props => {
  const selected = useMatch(props.to);
  const CustomLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement>((linkProps, ref) => (
        <Link ref={ref} to={props.to} {...linkProps} />
      )),
    [props.to]
  );

  return (
    <li>
      <ListItem selected={!!selected} button component={CustomLink}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItem>
    </li>
  );
};

const Menu = () => (
  <List>
    <ListItemLink to="dashboard" icon={<DashboardIcon />} text="Dashboard" />
    <ListItemLink to="invoices" icon={<ReceiptIcon />} text="Invoices" />
  </List>
);

interface AppDrawerProps {
  drawer: any;
  open?: boolean;
}

const AppDrawer: React.FC<AppDrawerProps> = props => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !props.drawer.open && classes.drawerPaperClose
        ),
      }}
      open={props.open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={props.drawer.closeDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <Menu />
    </Drawer>
  );
};

export default AppDrawer;
