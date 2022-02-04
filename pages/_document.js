import Document, { Html, Head, Main, NextScript } from 'next/document';

class Woongdo extends Document {
  render() {
    return (
      <Html lang='ko'>
        <Head>
          <meta name='theme-color' content='#fff' />
          <link rel='manifest' href='/manifest.json' />
          <link rel='apple-touch' href='/icon.png' />
        </Head>
        <body className='container-x mx-auto'>
          <Main />
          <NextScript />
        </body>
      </Html >
    );
  }
}

export default Woongdo;
