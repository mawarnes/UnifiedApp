import { App, Button, Form, type FormInstance, Input, Modal } from "antd";
import React, { useState } from "react";
import { login } from "./authAPI";
import { useAppDispatch } from "../../app/hooks";
import { updateToken, resetLoading, setLoading } from "./authSlice";
import { useNavigate } from "react-router";
type FieldType = {
  email?: string;
  password?: string;
};

export const LoginModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const formRef = React.useRef<FormInstance>(null);

  const onFinish = async (values: FieldType) => {
    dispatch(setLoading());
    const data = await login(values.email as string, values.password as string);
    dispatch(resetLoading());
    if (data?.isSucceed && data?.data) {
      message.success("Login is successful.");
      dispatch(updateToken(data.data));
      onClose();
      navigate("/");
    } else if (data != null) {
      data?.messages?.email &&
        formRef.current?.setFields([
          { name: "email", errors: data.messages?.email },
        ]);
      data?.messages?.password &&
        formRef.current?.setFields([
          { name: "password", errors: data.messages?.password },
        ]);
    } else {
      message.error("Login failed.");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Login"
      destroyOnHidden={true}

    >
      <Form ref={formRef} name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
