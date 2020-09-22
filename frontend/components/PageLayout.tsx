import React from 'react';
import SideNav from './SideNav';
import NavBar from './NavBar';
import { Layout } from 'antd';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
const { Footer, Content } = Layout;

const PageLayout: React.FC<{}> = ({ children }) => {
  return (
    <Layout>
      <SideNav />

      <Layout style={{ minHeight: '100vh' }}>
        <NavBar />
        <Content>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Improve Me ©2020 Created by TPolito
        </Footer>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
