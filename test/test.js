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

      assert.deepEqual(JSON.parse(ObjGen.xJson(model)), simple);
    });

    it('should generate a JSON object that uses _dots_ in prop names', function() {
      var dots = {
        "this.that": "xxx"
      };

      assert.deepEqual(JSON.parse(ObjGen.xJson('this.that s = xxx')), dots);
    });

    it('should generate an array of strings', function() {
      var model = 'a[] = 1, 2, 3';
      var strings = { a: ['1','2','3']};
      assert.deepEqual(JSON.parse(ObjGen.xJson(model)), strings);
    });

    it('should generate an array of objects using explicit indicies', function() {
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

      assert.deepEqual(JSON.parse(ObjGen.xJson(model)), objects);
    });

    it('should generate an array of objects using implied indicies', function() {
      var model = 'a[]\n' +
        '  id n = 1\n' +
        '  name = one\n' +
        'a[]\n' +
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

      assert.deepEqual(JSON.parse(ObjGen.xJson(model)), objects);
    });

    it('should generate a top level object array', function() {
      var model = '[]\n' +
        '  id n = 1\n' +
        '  name = one\n' +
        '[]\n' +
        '  id n = 2\n' +
        '  name = two\n' +
        '[]\n' +
        '  id n = 3\n' +
        '  name = three\n';

      var array = [
        {
          id: 1,
          name: 'one'
        },
        {
          id: 2,
          name: 'two'
        },
        {
          id: 3,
          name: 'three'
        }
      ];

      assert.deepEqual(JSON.parse(ObjGen.xJson(model)), array);
    });

    it('should generate a complex object', function() {
      var model = 'id n = 1\n' +
        'name = one\n' +
        'child\n' +
        '  id n = 1.1\n' +
        '  name = one.one\n' +
        'child2\n' +
        '  id n = 2.1\n' +
        '  name = two.one\n' +
        '  subArray[]\n' +
        '    id n = 2.11\n' +
        '    name = two.one.one\n' +
        '  subArray[]\n' +
        '    id n = 2.12\n' +
        '    name = two.one.two\n' +
        '  subArray[]\n' +
        '    id n = 2.13\n' +
        '    name = two.one.three\n' +
        'child3\n' +
        '  id n = 3.1\n' +
        '  name = three.one\n' +
        'flag b = true\n';

      var complex = {
        id: 1,
        name: 'one',
        child: {
          id: 1.1,
          name: 'one.one'
        },
        child2: {
          id: 2.1,
          name: 'two.one',
          subArray: [
            {
              id: 2.11,
              name: 'two.one.one'
            },
            {
              id: 2.12,
              name: 'two.one.two'
            },
            {
              id: 2.13,
              name: 'two.one.three'
            }
          ]
        },
        child3: {
          id: 3.1,
          name: 'three.one'
        },
        flag: true
      };

      assert.deepEqual(JSON.parse(ObjGen.xJson(model)), complex);
    });
  });
});
