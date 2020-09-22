import React from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useChangePasswordMutation } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { formLayout } from '../../utils/formLayout';
import Link from 'next/link';

const { Item } = Form;
const { Password } = Input;
const { Title } = Typography;

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  // Hooks
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [changePasswordForm] = Form.useForm();

  // Formik
  const formik = useFormik({
    initialValues: {
      newPassword: '',
    },
    onSubmit: async (values) => {
      const response = await changePassword({
        newPassword: values.newPassword,
        token,
      });

      if (response.data.changePassword.errors) {
        changePasswordForm.setFields([
          {
            name: 'changePassword',
            errors: [response.data?.changePassword.errors[0].message],
          },
        ]);
      } else if (response.data.changePassword.user) {
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
          <Title>Change Password Page</Title>
        </Col>
        <Col span={12} offset={6}>
          <Form
            initialValues={formik.initialValues}
            onFinish={formik.handleSubmit}
            onFinishFailed={handleFinishFail}
            form={changePasswordForm}
            {...formLayout}
          >
            <Item
              className="mt-2"
              label="Change Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Password must be at least 5 characters long',
                },
              ]}
            >
              <Password
                placeholder="Enter your email"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
              />
            </Item>
            <Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
