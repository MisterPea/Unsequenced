import validTextCheck from '../../components/helpers/validTextCheck';

describe('Is text valid', () => {
  const previousEntries = ['aaa', 'bbb', 'ccc', 'dd dd dd', '1. Test', '2.2.2....'];

  const testCases = [
    {
      description: 'accept upper and lowercase letters',
      text: 'AaBbCc',
      expect: 'true',
    },
    {
      description: 'accept upper and lowercase letters',
      text: '1. 23k10abcde',
      expect: 'true',
    },
    {
      description: 'not accept a name starting with a space',
      text: ' abcABC',
      expect: 'false',
    },
    {
      description: 'not accept a name starting with two spaces',
      text: '  abcABC',
      expect: 'false',
    },
    {
      description: 'not accepts a name a duplicate name',
      text: 'aaa',
      expect: 'false',
    },
    {
      description: 'not accepts a name a duplicate name',
      text: 'dd dd dd',
      expect: 'false',
    },
    {
      description: 'not accepts a name a duplicate name',
      text: '1. Test',
      expect: 'false',
    },
    {
      description: 'not accepts a name a duplicate name',
      text: '2.2.2....',
      expect: 'false',
    },
  ];

  testCases.forEach((test) => {
    it(`Should ${test.description}`, () => {
      const result = validTextCheck(test.text, previousEntries);
      expect(result.toString()).toMatch(test.expect);
    });
  });
});
