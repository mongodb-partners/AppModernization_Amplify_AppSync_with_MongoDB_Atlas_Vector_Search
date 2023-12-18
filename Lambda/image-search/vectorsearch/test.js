// test.js
// import { handler } from './index.mjs';

// const mockEvent = {
// };

// handler(mockEvent)
//   .then(response => console.log('Response:', response))
//   .catch(error => console.error('Error:', error));


  // test.mjs
  const { handler } = require('./index2.js');
  const fs = require('fs').promises;
  
  async function runTest() {
    try {
      // Read the contents of the event.json file
      const eventJson = await fs.readFile('event.json', 'utf8');
      // Parse the JSON content to get the event object
      const mockEvent = JSON.parse(eventJson);
  
      // Pass the event object to the handler
      const response = await handler(mockEvent);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  runTest();
  
  