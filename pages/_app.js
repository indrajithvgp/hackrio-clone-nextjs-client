import '../styles/globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Ed-Bucket</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/icons8-program-80.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
