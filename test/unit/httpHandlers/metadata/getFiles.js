'use strict';
const mocha = require('mocha');

let describe;
let it;
if (mocha.describe) {
  describe = mocha.describe;
  it = mocha.it;
} else {
  describe = global.describe;
  it = global.it;
}

describe('get file contents', async() => {
  it('should get file contents after passing req and res', async() => {
    try {

    } catch (err) {
      console.log(err);
    }
  });
});
