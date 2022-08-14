
        import React, { useState } from "react";
        import {
          AppBar,
          Typography,
          Toolbar,
          Box,
          Button,
          Tabs,
          Tab,
        } from "@mui/material";
        import { Link } from "react-router-dom";
        import { useDispatch, useSelector } from "react-redux";
        import { authActions } from "../store";
        import { useStyles } from "./utils";
        const Header = () => {
          const classes = useStyles();
          const dispath = useDispatch();
          const isLoggedIn = useSelector((state) => state.isLoggedIn);
        
          const [value, setValue] = useState();
          return (
            <AppBar
              position="sticky"
              sx={{
                background:
                  "linear-gradient(164deg, rgba(0,73,149,1) 6%, rgba(136,13,230,1) 37%, rgba(255,38,225,1) 100%)",
              }}
            >
              <Toolbar>
                <Typography className={classes.font} variant="h4">
                  HC
                </Typography>
                {isLoggedIn && (
                  <Box display="flex" marginLeft={"auto"} marginRight="auto">
                    <Tabs
                      textColor="inherit"
                      value={value}
                      onChange={(e, val) => setValue(val)}
                    >
                
                      <Tab
                        className={classes.font}
                        LinkComponent={Link}
                        to="/report"
                        label="My reports"
                      />
                      
                    </Tabs>
                  </Box>
                )}
                <Box display="flex" marginLeft="auto">
                  {!isLoggedIn && (
                    <>
                      {" "}
                      <Button
                        LinkComponent={Link}
                        to="/auth"
                        variant="contained"
                        sx={{ margin: 1, borderRadius: 10 }}
                        color="warning"
                      >
                        Login
                      </Button>
                  
                    </>
                  )}
                  {isLoggedIn && (
                    <Button
                      onClick={() => dispath(authActions.logout())}
                      LinkComponent={Link}
                      to="/auth"
                      variant="contained"
                      sx={{ margin: 1, borderRadius: 10 }}
                      color="warning"
                    >
                      Logout
                    </Button>
                  )}
                </Box>
              </Toolbar>
            </AppBar>
          );
        };
        
        export default Header;
     