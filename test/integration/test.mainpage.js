/* eslint no-undef: 0 */
/* eslint prefer-arrow-callback: 0 */
/**
* @file
*   Testing to verify the Text to Speech demo is working properly
*/

// Define the suite of tests and give it the following properties:
// - Title, which shows up before any of the pass/fails.
// - Number of tests, must be changed as you add tests.
// - suite(), which contains all of your tests.
//
// @see http://casperjs.readthedocs.org/en/latest
casper.test.begin('Text To Speech', 16, function suite(test) {
  const baseHost = 'http://localhost:3000';

  function testForButtons() {
    casper.waitForSelector('div.buttons-container', function () {
      test.assertExists('button.base--button.speak-button', 'displays speak button');
      test.assertExists('button.base--button.download-button', 'displays download button');
      test.assertExists('div.reset-container.dimmed', 'displays reset-container dimmed');
      test.assertExists('div.reset-container.dimmed > a.reset-button', 'displays reset-container dimmed with child link');
    });
  }

  function testForSelection() {
    casper.waitForSelector('div.voice-input', function () {
      test.assertExists('div.voice-input > select.base--select', 'has voice select');
    });
  }

  function testForAudio() {
    test.assertExists('audio.audio.hidden', 'has audio play bar hidden');
    test.comment('Clicking the Speak button...');

    // casper.then() allows us to wait until previous tests and actions are
    // completed before moving on to the next steps.
    casper.then(function () {
      this.click('button.base--button.speak-button');
      casper.waitForSelector('div.text-center', function () {
        test.assertExists('audio.audio', 'has audio play bar');
      });
    });
  }

  function testForTabpanels() {
    casper.then(function () {
      this.click('ul.tab-panels--tab-list li:nth-child(1)');
      test.assertSelectorHasText('ul.tab-panels--tab-list li:nth-child(1)', 'Text');
      test.assertSelectorHasText('div.tab-panels--tab-content > div > textarea', 'Conscious of its spiritual', 'Text is found');
      test.assertHttpStatus(200);
    });
    casper.then(function () {
      this.click('ul.tab-panels--tab-list li:nth-child(2)');
      test.assertSelectorHasText('ul.tab-panels--tab-list li:nth-child(2)', 'Expressive SSML');
      test.assertHttpStatus(200);
    });
    casper.then(function () {
      this.click('ul.tab-panels--tab-list li:nth-child(3)');
      test.assertSelectorHasText('ul.tab-panels--tab-list li:nth-child(3)', 'Voice Transformation SSML');
      test.assertHttpStatus(200);
    });
  }

  // casper.start() always wraps your first action. The first argument should
  // be the URL of the page you want to test.
  casper.start(baseHost, function (result) {
    test.assert(result.status === 200, 'Front page opens');
    test.assertEquals(this.getTitle(), 'Text to Speech Demo', 'Title is found');
    testForButtons();
    testForSelection();
    testForAudio();
    testForTabpanels();
  });

  // This code runs all the tests that we defined above.
  casper.run(function () {
    test.done();
  });
});
