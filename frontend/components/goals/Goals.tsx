import React from 'react';
import { useGetGoalsQuery } from '../../generated/graphql';
import Link from 'next/link';
import { Row } from 'antd';
import GoalCard from './GoalCard';

const Goals: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useGetGoalsQuery({
    requestPolicy: 'network-only',
  });

  if (fetching) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  } else if (data.getGoals.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>No goals!</p>
        {/* TODO: Make this a link to create goals page when its made */}
        <Link href="/add-goal" style={{ color: 'blue', cursor: 'pointer' }}>
          <a>Click here to create one</a>
        </Link>
      </div>
    );
  } else {
    return (
      <Row gutter={24} style={{ padding: '0 24px' }}>
        {data.getGoals?.map((goal) => {
          return (
            <GoalCard
              key={goal._id}
              title={goal.title}
              goalId={goal._id}
              desc={goal.desc}
              steps={goal.steps}
            />
          );
        })}
      </Row>
    );
  }
};

export default Goals;
