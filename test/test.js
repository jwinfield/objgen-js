var assert = require('chai').assert;
var ObjGen = require('../objgen.js').ObjGen;

describe('ObjGen', function() {
  describe('#xJson()', function() {
    it('should generate a simple JSON object', function() {
      var simple = {
        id: '1',
        name: 'test',
        amount: 100,
        when: '2017-03-09T12:34:56.789Z'
      };

      var model = 'id s = 1\n' +
        'name = test\n' +
        'amount n = 100\n' +
        'when d = 2017-03-09T12:34:56.789Z';

      assert.deepEqual(simple, JSON.parse(ObjGen.xJson(model)));
    });

    it('should generate an array of strings', function() {
      var model = 'a[] = 1, 2, 3';
      var strings = { a: ['1','2','3']};
      assert.deepEqual(strings, JSON.parse(ObjGen.xJson(model)));
    });

    it('should generate an array of objects', function() {
      var model = 'a[0]\n' +
        '  id n = 1\n' +
        '  name = one\n' +
        'a[1]\n' +
        '  id n = 2\n' +
        '  name = two\n';

      var objects = {
        a: [
        {
          id: 1,
          name: 'one'
        },
        {
          id: 2,
          name: 'two'
        }]
      };

      assert.deepEqual(objects, JSON.parse(ObjGen.xJson(model)));
    });
  });
});
