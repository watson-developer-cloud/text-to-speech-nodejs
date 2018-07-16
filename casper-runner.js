require('dotenv').config();

if (!process.env.TEXT_TO_SPEECH_USERNAME && !process.env.TEXT_TO_SPEECH_IAM_APIKEY) {
  console.log('Skipping integration tests because TEXT_TO_SPEECH_USERNAME and TEXT_TO_SPEECH_IAM_APIKEY are null');
  process.exit(0);
}

const spawn = require('child_process').spawn; // eslint-disable-line
const app = require('./app');

const port = 3000;

const server = app.listen(port, () => {
  console.log('Server running on port: %d', port);

  function kill(code) {
    server.close(() => {
      // eslint-disable-next-line no-process-exit
      process.exit(code);
    });
  }

  function runTests() {
    const casper = spawn('npm', ['run', 'test-integration']);
    casper.stdout.pipe(process.stdout);

    casper.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.log(`ERROR: ${error}`);
      server.close(() => {
        process.exit(1);
      });
    });

    casper.on('close', kill);
  }

  runTests();
});
