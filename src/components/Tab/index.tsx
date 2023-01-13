import React from "react";
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import './styles.scss'

export interface IStyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#b62985",
      height: "4px",
      borderTopRightRadius: 3,
      borderTopLeftRadius: 3,
    },
  },
})((props: IStyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
));

export interface IStyledTabProps {
  label: string;
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      color: "#848f9f",
      flex: 1,
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      "&:focus": {
        opacity: 1,
      },
      "&:hover": {
        color: "#b62985",
        opacity: 1,
      },
      "&$selected": {
        color: "#b62985",
        fontWeight: theme.typography.fontWeightMedium,
      },
      maxWidth: "none",
    },
    selected: {},
  })
)((props: IStyledTabProps) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // // flexGrow: 1,
    // padding: 0,
    // paddingTop: 24,
  },
  padding: {
    // paddingTop: 24,
    // padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export interface ITabView {
  routes: Array<string>;
  children: React.ReactNode;
  onChange?: (event: React.ChangeEvent<{}>, newValue: number) => void;
}
const TabView: React.FC<ITabView> = ({ routes, children, onChange }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    if (onChange) onChange(event, newValue);
  };

  return (
    <div className="tab-container">
      <div className={classes.root}>
        <div className={classes.demo2}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            aria-label="ant example"
          >
            {routes.map((route) => (
              <StyledTab label={route} />
            ))}
          </StyledTabs>

          {React.Children.map(children, (child, index) => (
            <TabPanel value={value} index={index}>
              {child}
            </TabPanel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabView;
