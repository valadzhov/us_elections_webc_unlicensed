import { expect } from '@open-wc/testing';
import CandidatesAndVotes from './candidates-and-votes.js';

describe('CandidatesAndVotes', () => {
  it('<app-candidates-and-votes> is an instance of CandidatesAndVotes', async () => {
    const element = document.createElement('app-candidates-and-votes');
    expect(element).to.be.instanceOf(CandidatesAndVotes);
  });
});
