<<<<<<< HEAD
<<<<<<< HEAD
import React from "react"; // Required by eslint react/react-in-jsx-scope
=======
import React from "react";
>>>>>>> 27cc4dc67 (Add admin storybook. Bump to latest storybook. Eliminate deviations from production scenario so storybook is a closer match. Decompose chrome into a separate file.)
=======
import React from "react"; // Required by eslint react/react-in-jsx-scope
>>>>>>> 2a74ccd2e (review feedback)
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { AppBar, Sidebar } from "react-admin";

export const HiddenAppBar = withStyles({
  hideOnDesktop: {
    "@media (min-width: 768px) and (min-height: 480px)": {
      display: "none"
    }
  }
})(props => {
<<<<<<< HEAD
<<<<<<< HEAD
  const { classes, className, ...appBarProps } = props;
  return <AppBar {...appBarProps} className={classNames(classes.hideOnDesktop, className)} />;
=======
  const { classes, ...other } = props;
  return <AppBar {...other} className={classes.hideOnDesktop} />;
>>>>>>> 27cc4dc67 (Add admin storybook. Bump to latest storybook. Eliminate deviations from production scenario so storybook is a closer match. Decompose chrome into a separate file.)
=======
  const { classes, className, ...appBarProps } = props;
  return <AppBar {...appBarProps} className={classNames(classes.hideOnDesktop, className)} />;
>>>>>>> 2a74ccd2e (review feedback)
});

export const AdminSidebar = withStyles({
  sidebarScrollingIndicator: {
    position: "sticky",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    color: "#aaaaaa",
    pointerEvents: "none",
    zIndex: 9999,
    transition: "opacity 0.5s ease",
    opacity: 1
  },
  topIndicator: {
    top: 0,
    background: "linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 0%, rgba(34, 34, 34, 0.7) 70%, transparent 100%)"
  },
  bottomIndicator: {
    bottom: 0,
    background: "linear-gradient(to top, rgba(0, 0, 0, 1.0) 0%, rgba(34, 34, 34, 0.7) 70%, transparent 100%)"
  }
})(props => {
<<<<<<< HEAD
<<<<<<< HEAD
  const { classes, className, children, ...sidebarProps } = props;
  return (
    <Sidebar {...sidebarProps} className={classNames("adminSidebar", className)}>
      <div className={classNames("adminSidebarTopIndicator", classes.sidebarScrollingIndicator, classes.topIndicator)}>
        <KeyboardArrowUpIcon />
      </div>
      {children}
=======
  const { classes, ...other } = props;
=======
  const { classes, className, children, ...sidebarProps } = props;
>>>>>>> 2a74ccd2e (review feedback)
  return (
    <Sidebar {...sidebarProps} className={classNames("adminSidebar", className)}>
      <div className={classNames("adminSidebarTopIndicator", classes.sidebarScrollingIndicator, classes.topIndicator)}>
        <KeyboardArrowUpIcon />
      </div>
<<<<<<< HEAD
      {other.children}
>>>>>>> 27cc4dc67 (Add admin storybook. Bump to latest storybook. Eliminate deviations from production scenario so storybook is a closer match. Decompose chrome into a separate file.)
=======
      {children}
>>>>>>> 2a74ccd2e (review feedback)
      <div
        className={classNames(
          "adminSidebarBottomIndicator",
          classes.sidebarScrollingIndicator,
          classes.bottomIndicator
        )}
      >
        <KeyboardArrowDownIcon />
      </div>
    </Sidebar>
  );
});
