import { Space,App, Layout, Menu, Dropdown, Button } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { AppLogo } from "../features/AppLogo";
import { AppFooter } from "../features/Footer";

export const DefaultLayout = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const [current, setCurrent] = useState(
    location.pathname === "/" || location.pathname === ""
      ? "/"
      : location.pathname
  );

  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(location.pathname);
      }
    }
  }, [location]);

  const handleClick = (key: string) => {
    navigate(key);
  };

    // Menu for login/register
  const loginMenu = {
    items: [
      {
        key: "/login",
        label: "Login",
        onClick: () => handleClick("/login"),
      },
      {
        key: "/register",
        label: "Register",
        onClick: () => handleClick("/register"),
      },
    ],
  };

  return (
    <App>
      <Layout className="layout">
        <Header style={{ display: "flex", alignItems: "center" }}>
          <AppLogo />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["/"]}
            selectedKeys={[current]}
            items={[
              // {
              //   key: "/",
              //   label: "Home",
              //   onClick: (e) => {
              //     handleClick(e.key);
              //   },
              // },
            ]}          style={{ flex: 1, minWidth: 0 }}
        />        
          <Dropdown menu={loginMenu} trigger={["click"]}>
            <Button type="text" style={{ color: "#fff", marginLeft: 24 }}>
              Login
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ padding: "0 50px", minHeight: "400px" }}>
          <Outlet />
        </Content>
      </Layout>
      <AppFooter />
    </App>
  );
};
