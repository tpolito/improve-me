import React, { CSSProperties } from 'react';
import { Card, Col, Checkbox, Popconfirm } from 'antd';
import {
  useDeleteGoalMutation,
  useToggleStepMutation,
} from '../../generated/graphql';

interface GoalCardProps {
  title: string;
  desc: string;
  goalId: string;
  steps: {
    _id: string;
    name: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
}

const cardStyles: CSSProperties = {
  boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)',
};

const GoalCard: React.FC<GoalCardProps> = ({ title, desc, goalId, steps }) => {
  const [, deleteGoal] = useDeleteGoalMutation();
  const [, toggleStep] = useToggleStepMutation();

  const handleDelete = async () => {
    await deleteGoal({ id: goalId });

    return true;
  };

  const handleCheckbox = async (stepId: string) => {
    await toggleStep({ goalId, stepId });

    return true;
  };

  return (
    // Four "Goals" per line
    <Col span={6}>
      <Card
        title={title}
        style={cardStyles}
        extra={
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            placement="bottom"
            onConfirm={() => handleDelete()}
          >
            <a style={{ color: 'red' }}>Delete</a>
          </Popconfirm>
        }
      >
        <p>{desc}</p>
        <hr />
        <ul>
          {steps.map((step) => {
            return (
              <div key={step._id}>
                <Checkbox
                  defaultChecked={step.completed}
                  onChange={() => {
                    handleCheckbox(step._id);
                  }}
                >
                  {step.name}
                </Checkbox>
              </div>
            );
          })}
        </ul>
      </Card>
    </Col>
  );
};

export default GoalCard;
