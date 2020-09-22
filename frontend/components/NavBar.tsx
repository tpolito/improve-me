import React, { CSSProperties } from 'react';
import { Layout, Menu } from 'antd';
import {
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import Link from 'next/link';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const { Header } = Layout;
const { Item } = Menu;

// CSS for Header
const headerStyles: CSSProperties = {
  textAlign: 'center',
  color: 'white',
};

const NavBar: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [, logout] = useLogoutMutation();

  if (fetching) {
    // We are loading
    return null;
  } else if (!data?.me) {
    return (
      <Header style={headerStyles}>
        <Menu style={{ float: 'right' }} theme="dark" mode="horizontal">
          <Item icon={<LoginOutlined />} key="1">
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>
          <Item icon={<UserAddOutlined />} key="2">
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>
        </Menu>
      </Header>
    );
  } else if (data?.me) {
    return (
      <Header style={headerStyles}>
        <Menu style={{ float: 'right' }} theme="dark" mode="horizontal">
          <Item icon={<UserOutlined />} key="1">
            {data?.me.username}
          </Item>
          <Item
            onClick={() => {
              logout();
            }}
            icon={<LogoutOutlined />}
            key="2"
          >
            Logout
          </Item>
        </Menu>
      </Header>
    );
  }
};

export default NavBar;
