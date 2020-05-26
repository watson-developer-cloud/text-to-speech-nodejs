import React from 'react';
import PropTypes from 'prop-types';
import { Header, Jumbotron } from 'watson-react-components';

// eslint-disable-next-line
const DESCRIPTION = 'The Text to Speech service understands text and natural language to generate synthesized audio output complete with appropriate cadence and intonation. It is available in 27 voices (13 neural and 14 standard) across 7 languages. Select voices now offer Expressive Synthesis and Voice Transformation features.';
const GDPR_INFO = 'This system is for demonstration purposes only and is not intended to process Personal Data. No Personal Data is to be entered into this system as it may not have the necessary controls in place to meet the requirements of the General Data Protection Regulation (EU) 2016/679';
const TERMS_OF_USE_URL = 'https://watson-developer-cloud.github.io/terms?name=Text-to-Speech%20Demo';

function Layout(props) {
  const { children } = props;
  return (
    <html lang="en">
      <head>
        <title>
          Text to Speech Demo
        </title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="og:title" content="Text to Speech Demo" />
        <meta name="og:description" content={DESCRIPTION} />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png" />
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="stylesheet" href="/css/watson-react-components.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
      </head>
      <body>
        <Header
          mainBreadcrumbs="Text to Speech"
          mainBreadcrumbsUrl="https://www.ibm.com/watson/services/text-to-speech/"
          subBreadcrumbs="Text to Speech Demo"
          subBreadcrumbsUrl="https://text-to-speech-demo.mybluemix.net"
        />
        <Jumbotron
          serviceName="Text to Speech"
          repository="https://github.com/watson-developer-cloud/text-to-speech-nodejs"
          documentation="https://cloud.ibm.com/docs/text-to-speech?topic=text-to-speech-gettingStarted"
          apiReference="https://cloud.ibm.com/apidocs/text-to-speech"
          startInBluemix="https://cloud.ibm.com/registration/?target=%2Fcatalog%2Fservices%2Fnatural-language-understanding%3FhideTours%3Dtrue%26cm_mmc%3D-_-Watson%2BCore_Watson%2BCore%2B-%2BPlatform-_-WW_WW-_-wdc-ref%26cm_mmc%3D-_-Watson%2BCore_Watson%2BCore%2B-%2BPlatform-_-WW_WW-_-wdc-ref%26cm_mmca1%3D000000OF%26cm_mmca2%3D10000409"
          version="GA"
          serviceIcon="/images/service-icon.svg"
          description={DESCRIPTION}
        />
        <div className="_container _container_large gdpr-info">
          {GDPR_INFO}
        </div>
        <div className="_container _container_large gdpr-info">
          By using this application, you agree to the &nbsp;
          <a target="_blank" rel="noreferrer noopener" href={TERMS_OF_USE_URL}>
                Terms of Use
          </a>
        </div>
        <div id="root">
          {children}
        </div>
        <script type="text/javascript" src="js/bundle.js" />
        <script type="text/javascript" src="https://cdn.rawgit.com/watson-developer-cloud/watson-developer-cloud.github.io/master/analytics.js" />
      </body>
    </html>
  );
}

Layout.propTypes = {
  children: PropTypes.object.isRequired, // eslint-disable-line
};

export default Layout;
