import React from 'react';
import { Row, Col, Typography } from 'antd';
import { useMeQuery, useGetGoalsQuery } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import PageLayout from '../components/PageLayout';
import Goals from '../components/goals/Goals';

const { Title } = Typography;
const Index = () => {
  const [{ data, fetching }] = useMeQuery();

  console.log();

  if (fetching) {
    // We are loading
    return null;
  } else if (!data?.me) {
    // Not logged in
    return (
      <PageLayout>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title>Home Page</Title>
          </Col>
        </Row>
      </PageLayout>
    );
  } else if (data?.me) {
    return (
      <PageLayout>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title>Hello {data?.me.username}</Title>
          </Col>
        </Row>
        <Goals />
      </PageLayout>
    );
  }
};

export default withUrqlClient(createUrqlClient)(Index);
