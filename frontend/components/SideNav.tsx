import React, { useState, CSSProperties } from 'react';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  PlusSquareOutlined,
  GitlabOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;
const { Item } = Menu;
interface NavBarProps {}

// Temp CSS For Logo
const logoStyles: CSSProperties = {
  height: '32px',
  background: 'rgba(255, 255, 255, 0.2)',
  cursor: 'pointer',
  margin: '16px',
};

const SideNav: React.FC<NavBarProps> = ({}) => {
  // State
  const [state, setState] = useState({
    collapsed: false,
  });

  // Sets the state to the opposite of what is to toggle the collpase
  const onCollapse = () => {
    setState({
      collapsed: !state.collapsed,
    });
  };
  return (
    <Sider collapsible collapsed={state.collapsed} onCollapse={onCollapse}>
      <Link href="/">
        <div style={logoStyles} />
      </Link>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Item key="1" icon={<PlusSquareOutlined />}>
          <Link href="/add-goal">
            <a>Add New Goal</a>
          </Link>
        </Item>
        <Item key="2" icon={<DesktopOutlined />}>
          Option 2
        </Item>
        <Item key="3" icon={<GitlabOutlined />}>
          Option 3
        </Item>
        <Item key="4" icon={<TwitterOutlined />}>
          Option 4
        </Item>
      </Menu>
    </Sider>
  );
};

export default SideNav;
