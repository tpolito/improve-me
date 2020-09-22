import React from 'react';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useRegisterMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { formLayout } from '../utils/formLayout';
import Link from 'next/link';

const { Title } = Typography;
const { Item } = Form;
const { Password } = Input;

const register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  const [registerForm] = Form.useForm();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      const response = await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      // Check and set errors
      if (response.data?.createUser.errors) {
        // Handle Errors
        registerForm.setFields([
          {
            name: response.data?.createUser.errors[0].field,
            errors: [response.data?.createUser.errors[0].message],
          },
        ]);
      } else if (response.data?.createUser.user) {
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
        <Link href='/'>
          <a>home</a>
        </Link>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title>Register Page</Title>
        </Col>
        <Col span={12} offset={6}>
          <Form
            initialValues={formik.initialValues}
            onFinish={formik.handleSubmit}
            onFinishFailed={handleFinishFail}
            form={registerForm}
            {...formLayout}
          >
            <Item
              className='mt-2'
              label='Username'
              name='username'
              rules={[{ required: true, message: 'Please input a username' }]}
            >
              <Input
                placeholder='Enter your username'
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </Item>
            <Item
              className='mt-2'
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please input a valid email',
                },
              ]}
            >
              <Input
                placeholder='Enter your email'
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </Item>
            <Item
              className='mt-2'
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input a password',
                },
              ]}
            >
              <Password
                placeholder='Enter your password'
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </Item>
            <Item style={{ textAlign: 'center' }}>
              <Button type='primary' htmlType='submit'>
                Register
              </Button>
            </Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(register);
