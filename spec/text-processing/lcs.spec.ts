import { findLSC } from 'ads';
import * as chai from 'chai';

describe('findLCS()', function() {
  const seqX = 'acgtgca';
  const seqY = 'cagtcgatcg';

  it('should find the longest common substring of given sequences', function() {
    chai.expect(findLSC(seqX, seqY)).to.equal('acgtg');
  });

  it('should return an empty string if one of the two sequences is empty', function() {
    chai.expect(findLSC(seqX, '')).to.equal('');
    chai.expect(findLSC('', seqY)).to.equal('');
    chai.expect(findLSC('', '')).to.equal('');
  });
});
