import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useRouter } from 'next/router';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import { formLayout } from '../utils/formLayout';
import { useFormik } from 'formik';
import { useAddGoalMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Item } = Form;

interface addGoalProps {}

const addGoal: React.FC<addGoalProps> = ({}) => {
  // TODO: Figure out a way to handle this, right now this state is here just to trigger a rerender
  let [stepCount, setStepCount] = useState(1);
  const router = useRouter();
  const [, addGoal] = useAddGoalMutation();

  const formik = useFormik({
    initialValues: {
      title: '',
      desc: '',
      steps: [''],
    },
    onSubmit: async (values) => {
      const { title, desc, steps } = values;

      const response = await addGoal({ title, desc, steps });

      if (response.data?.addGoal.errors) {
        addGoalForm.setFields([
          {
            name: 'title',
            errors: [response.data?.addGoal.errors[0].message],
          },
        ]);
      } else if (response.data?.addGoal.goal) {
        router.push('/');
      }
    },
  });

  const handleFinishFail = (errorInfo) => {
    console.error(`Failed: ${JSON.stringify(errorInfo)}`);
  };

  const handleAddStep = () => {
    // If more than 5 steps throw error
    if (stepCount >= 5) {
      addGoalForm.setFields([
        {
          name: 'title',
          errors: ['You cannot have more than 5 steps'],
        },
      ]);

      return;
    }

    // Create new steps in increment step counter
    formik.values.steps.push('');
    setStepCount(stepCount + 1);
  };

  const handleRemoveStep = () => {
    formik.values.steps.pop();
    setStepCount(stepCount - 1);
  };

  const [addGoalForm] = Form.useForm();

  return (
    <PageLayout>
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title>Add Goal Page</Title>
        </Col>
        <Col span={12} offset={6}>
          <Form
            initialValues={formik.initialValues}
            onFinish={formik.handleSubmit}
            onFinishFailed={handleFinishFail}
            form={addGoalForm}
            {...formLayout}
          >
            <Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: 'Please enter a title for your goal',
                },
              ]}
            >
              <Input
                placeholder="Enter the title of your new goal"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
            </Item>

            <Item
              name="desc"
              label="Description"
              rules={[
                {
                  required: true,
                  message: 'Please enter a description for your goal',
                },
              ]}
            >
              <Input
                value={formik.values.desc}
                placeholder="A short description of your goal"
                onChange={formik.handleChange}
              />
            </Item>

            {formik.values.steps.map((step, i) => {
              return (
                <Item
                  name={`steps[${i}]`}
                  label={`Step #${i + 1}`}
                  key={i}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter a step of your step',
                    },
                  ]}
                >
                  <Input
                    value={formik.values.steps[i]}
                    placeholder="A short description of your step"
                    onChange={formik.handleChange}
                  />
                </Item>
              );
            })}

            <Item style={{ textAlign: 'center', display: 'inline' }}>
              <Button type="primary" onClick={handleAddStep}>
                Add Step
              </Button>

              {stepCount === 0 ? null : (
                <Button
                  style={{ marginLeft: '12px' }}
                  type="primary"
                  onClick={handleRemoveStep}
                >
                  Remove Step
                </Button>
              )}
            </Item>

            <hr />

            <Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                Add Goal
              </Button>
            </Item>
          </Form>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default withUrqlClient(createUrqlClient)(addGoal);
