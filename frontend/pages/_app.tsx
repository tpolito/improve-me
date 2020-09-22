import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/vars.css';
import '../styles/global.css';

import { Layout } from 'antd';
import SideNav from '../components/SideNav';
import NavBar from '../components/NavBar';

const { Footer, Content } = Layout;

// Custom URQL Update Query

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Improve Me</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />\
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
