import { indexOfBM } from 'ads';
import * as chai from 'chai';

describe('indexOfBM()', function() {
  const source = 'some test\nstring';

  it('should find the leftmost index at which pattern begins in the source string', function() {
    chai.expect(indexOfBM(source, 'st')).to.equal(7);
  });

  it('should handle special characters correctly', function() {
    chai.expect(indexOfBM(source, ' ')).to.equal(4);
    chai.expect(indexOfBM(source, ' t')).to.equal(4);
    chai.expect(indexOfBM(source, '\n')).to.equal(9);
  });

  it('should return 0 if the pattern is empty', function() {
    chai.expect(indexOfBM(source, '')).to.equal(0);
  });

  it('should return -1 if the source does not contain the pattern', function() {
    chai.expect(indexOfBM(source, 'not contain')).to.equal(-1);
  });
});
