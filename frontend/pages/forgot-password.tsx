import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { useFormik } from 'formik';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { formLayout } from '../utils/formLayout';
import Link from 'next/link';

const { Item } = Form;
const { Title } = Typography;

const forgotPassword: React.FC<{}> = ({}) => {
  // Hooks
  const [completed, setCompleted] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  const [forgotPasswordForm] = Form.useForm();

  // Formik
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: async (values) => {
      await forgotPassword(values);
      setCompleted(true);
    },
  });
  // Look into validateTrigger (antd Form docs)
  const handleFinishFail = (errorInfo) => {
    console.error(`Failed: ${JSON.stringify(errorInfo)}`);
  };

  if (completed) {
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title>Forgot Password Page</Title>
          <p>If an account with that email exists, we went you an email.</p>
        </Col>
      </Row>
    );
  } else {
    return (
      <>
        <Row>
          <Link href="/">
            <a>home</a>
          </Link>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title>Forgot Password Page</Title>
          </Col>
          <Col span={12} offset={6}>
            <Form
              initialValues={formik.initialValues}
              onFinish={formik.handleSubmit}
              onFinishFailed={handleFinishFail}
              form={forgotPasswordForm}
              {...formLayout}
            >
              <Item
                className="mt-2"
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Please enter a valid email',
                  },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  value={formik.values.email}
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
  }
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
