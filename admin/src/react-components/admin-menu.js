/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import inflection from "inflection";
import { NavLink } from "react-router-dom";
import withStyles from "@mui/styles/withStyles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BackupIcon from "@mui/icons-material/Backup";
import ViewIcon from "@mui/icons-material/ViewList";
import SettingsIcon from "@mui/icons-material/Settings";
import Collapse from "@mui/material/Collapse";
import HubsLogo from "../assets/images/hubs_logo.png";

const styles = () => ({
  root: {
    width: "100%",
    paddingTop: 0,
    backgroundColor: "#222222",

    "& .active": {
      backgroundColor: "#1700c7 !important"
    },

    "& .active div span": {
      color: "#ffffff !important"
    },

    "& .active svg": {
      color: "#FFFFFF !important"
    },

    active: {
      color: "#ff0000"
    }
  },
  item: {
    padding: "8px 16px"
  },
  logo: {
    margin: 0,
    padding: 0,
    backgroundColor: "#222222 !important",

    "& img": {
      padding: "0 12px 8px 12px",
      width: "200px"
    }
  },
  icon: {
    marginRight: 0,
    color: "#aaaaaa"
  },
  text: {
    paddingLeft: 10,

    "& span": {
      // Used to override typography
      color: "#eeeeee",
      fontSize: 14
    }
  },
  nested: {
    paddingLeft: 40
  }
});

function getResourceDisplayName(resource) {
  if (resource.options && resource.options.label) {
    return resource.options.label;
  } else {
    return inflection.humanize(inflection.pluralize(resource.name));
  }
}

function Menu(props) {
  const containerRef = useRef(null);
  const sidebarScrollArea = useRef(null);
  const rafId = useRef(null);
  const attachAttemptsLeft = useRef(5);

  const renderResource = resource => {
    if (!resource.hasList) return null;

    const icon = resource.icon ? <resource.icon /> : <ViewIcon />;
    return (
      <ListItem
        className={classNames(props.classes.item, props.classes.nested)}
        component={NavLink}
        key={resource.name}
        to={`/${resource.name}`}
      >
        {icon && <ListItemIcon className={props.classes.icon}>{icon}</ListItemIcon>}
        <ListItemText className={props.classes.text} primary={getResourceDisplayName(resource)} />
      </ListItem>
    );
  };

  const handleSidebarScrolling = () => {
    const element = sidebarScrollArea.current;
    if (!element) return;

    const topIndicator = document.querySelector(".adminSidebar .adminSidebarTopIndicator");
    const bottomIndicator = document.querySelector(".adminSidebar .adminSidebarBottomIndicator");

    const elementScrollBottom = element.scrollHeight - element.clientHeight - element.scrollTop;

    if (topIndicator) topIndicator.style.display = element.scrollTop < 22 ? "none" : "flex";
    if (bottomIndicator) bottomIndicator.style.display = elementScrollBottom < 22 ? "none" : "flex";
  };

  useEffect(() => {
    const getScrollableAncestor = node => {
      let el = node?.parentElement || null;
      while (el) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const isScrollableY = overflowY === "auto" || overflowY === "scroll" || el.scrollHeight > el.clientHeight + 1;
        if (isScrollableY) return el;
        el = el.parentElement;
      }
      return null;
    };

    // The Drawer that wraps <Sidebar> defers attaching the scrollable `<div>` that actually receives the
    // overflow styles until after the first paint. On the initial frame the ancestor walk returns `null`,
    // so we retry a handful of times via rAF to ensure we subscribe once Material-UI finishes mounting.
    const tryAttach = () => {
      if (sidebarScrollArea.current) return; // already attached
      const container = containerRef.current;
      const el = container ? getScrollableAncestor(container) : null;
      if (el) {
        sidebarScrollArea.current = el;
        if (sidebarScrollArea.current.addEventListener) {
          sidebarScrollArea.current.addEventListener("scroll", handleSidebarScrolling, { passive: true });
        }
        handleSidebarScrolling();
        return;
      }
      if (attachAttemptsLeft.current > 0) {
        attachAttemptsLeft.current -= 1;
        rafId.current = requestAnimationFrame(tryAttach);
      }
    };

    attachAttemptsLeft.current = 5;
    tryAttach();
    window.addEventListener("resize", handleSidebarScrolling);
    // Defer initial compute to ensure layout stabilized
    rafId.current = requestAnimationFrame(handleSidebarScrolling);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (sidebarScrollArea.current && sidebarScrollArea.current.removeEventListener) {
        sidebarScrollArea.current.removeEventListener("scroll", handleSidebarScrolling);
      }
      window.removeEventListener("resize", handleSidebarScrolling);
    };
  });

  return (
    <List className={props.classes.root} ref={containerRef}>
      <ListItem className={props.classes.logo}>
        <img className={props.classes.logo} src={HubsLogo} />
      </ListItem>
      <ListItem
        className={props.classes.item}
        component={NavLink}
        activeStyle={{ backgroundColor: "#D0D0D0" }}
        key="home"
        to="/home"
      >
        <ListItemIcon className={props.classes.icon}>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText className={props.classes.text} primary="Home" />
      </ListItem>
      <ListItem className={props.classes.item}>
        <ListItemIcon className={props.classes.icon}>
          <LibraryBooksIcon />
        </ListItemIcon>
        <ListItemText className={props.classes.text} primary="Content" />
      </ListItem>
      <Collapse in={true} timeout="auto" unmountOnExit>
        <List component="nav" disablePadding>
          <ListItem
            className={classNames(props.classes.item, props.classes.nested)}
            component={NavLink}
            key="import"
            to="/import"
          >
            <ListItemIcon className={props.classes.icon}>
              <BackupIcon />
            </ListItemIcon>
            <ListItemText className={props.classes.text} primary="Import Content" />
          </ListItem>
          {props.resources.map(renderResource)}
        </List>
      </Collapse>
      <ListItem className={props.classes.item}>
        <ListItemIcon className={props.classes.icon}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText className={props.classes.text} primary="Setup" />
      </ListItem>
      <Collapse in={true} timeout="auto" unmountOnExit>
        <List component="nav" disablePadding>
          <ListItem
            className={classNames(props.classes.item, props.classes.nested)}
            component={NavLink}
            key="app-settings"
            to="/app-settings"
          >
            <ListItemIcon className={props.classes.icon}>
              <ViewIcon />
            </ListItemIcon>
            <ListItemText className={props.classes.text} primary="App Settings" />
          </ListItem>

          {/* BRANDING */}
          <ListItem
            className={classNames(props.classes.item, props.classes.nested)}
            component={NavLink}
            key="brand"
            to="/brand"
          >
            <ListItemIcon className={props.classes.icon}>
              <ViewIcon />
            </ListItemIcon>
            <ListItemText className={props.classes.text} primary="Brand" />
          </ListItem>

          {/* THEMES  */}
          <ListItem
            className={classNames(props.classes.item, props.classes.nested)}
            component={NavLink}
            key="themes"
            to="/themes"
          >
            <ListItemIcon className={props.classes.icon}>
              <ViewIcon />
            </ListItemIcon>
            <ListItemText className={props.classes.text} primary="Themes" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
}

export const AdminMenu = withStyles(styles)(Menu);
