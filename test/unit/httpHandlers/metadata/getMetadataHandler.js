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

describe('get metadata', async() => {
  it('should get metadata after passing req and res', async() => {
    try {

    } catch (err) {
      console.log(err);
    }
  });
});
