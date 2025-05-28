import { Breadcrumb } from "antd";
import { LoginModal } from "../features/user/Login";
import { useState } from "react";

export const LoginPage = () => {
    const [open, setOpen] = useState(true);
  <>
    <Breadcrumb
      style={{ margin: "16px 0" }}
      items={[{ key: 1, title: "Login", separator: "/" }]}
    ></Breadcrumb>
      <LoginModal open={open} onClose={() => setOpen(false)} />
  </>
};
