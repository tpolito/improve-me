import React from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { formLayout } from '../utils/formLayout';
import Link from 'next/link';

const { Item } = Form;
const { Password } = Input;
const { Title } = Typography;

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  // Hooks
  const router = useRouter();
  const [, login] = useLoginMutation();
  const [loginForm] = Form.useForm();

  // Formik
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      const response = await login({
        username: values.username,
        password: values.password,
      });

      // Check and set errors
      if (response.data?.login.errors) {
        // Handle Errors
        loginForm.setFields([
          {
            name: response.data?.login.errors[0].field,
            errors: [response.data?.login.errors[0].message],
          },
        ]);
      } else if (response.data?.login.user) {
        router.push('/');
      }
    },
  });
  // Look into validateTrigger (antd Form docs)
  const handleFinishFail = (errorInfo) => {
    console.error(`Failed: ${JSON.stringify(errorInfo)}`);
  };
  return (
    <>
      <Row>
        <Link href="/">
          <a>home</a>
        </Link>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title>Login Page</Title>
        </Col>
        <Col span={12} offset={6}>
          <Form
            initialValues={formik.initialValues}
            onFinish={formik.handleSubmit}
            onFinishFailed={handleFinishFail}
            form={loginForm}
            {...formLayout}
          >
            <Item
              className="mt-2"
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username' },
              ]}
            >
              <Input
                placeholder="Enter your username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </Item>
            <Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password' },
              ]}
              style={{ marginBottom: '8px' }}
            >
              <Password
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </Item>
            <Link href="/forgot-password">
              <a>forgot password?</a>
            </Link>

            <Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(login);
