import { LinkedStack } from 'src/queues';
import * as chai from 'chai';

describe('LinkedStack', function() {
  let stack: LinkedStack<number>;

  beforeEach(() => {
    stack = new LinkedStack([1, 2, 3]);
  });

  describe('constructor()', function() {
    it('should create a stack without elements', function() {
      stack = new LinkedStack();
      chai.expect(stack.length).to.equal(0);
    });
  });

  describe('push()', function() {
    it('should push element to the top of the stack', function() {
      stack.push(4);
      stack.push(5);
      chai.expect(stack.pop()).to.equal(5);
      chai.expect(stack.pop()).to.equal(4);
    });

    it('should increment the stack length by one', function() {
      chai.expect(stack.length).to.equal(3);
      stack.push(4);
      chai.expect(stack.length).to.equal(4);
    });
  });

  describe('clear()', function() {
    it('should clear the stack', function() {
      stack.clear();
      chai.expect(stack.top.bind(stack)).to.throw('Stack is empty');
    });

    it('should reduce the stack length to 0', function() {
      chai.expect(stack.length).to.equal(3);
      stack.clear();
      chai.expect(stack.length).to.equal(0);
    });
  });

  describe('length', function() {
    it('should return count of elements in the stack', function() {
      chai.expect(stack.length).to.equal(3);
    });
  });

  describe('top()', function() {
    it('should throw if the stack is empty', function() {
      stack.clear();
      chai.expect(stack.top.bind(stack)).to.throw('Stack is empty');
    });

    it('should return the element on the top of the stack', function() {
      chai.expect(stack.top()).to.equal(1);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the stack is empty', function() {
      stack.clear();
      chai.expect(stack.isEmpty()).to.be.true;
    });

    it('should return false if the stack has elements', function() {
      chai.expect(stack.isEmpty()).to.be.false;
    });
  });

  describe('pop()', function() {
    it('should throw if the stack is empty', function() {
      stack.clear();
      chai.expect(stack.pop.bind(stack)).to.throw('Stack is empty');
    });

    it('should remove and return the element from the top of the stack', function() {
      chai.expect(stack.pop()).to.equal(1);
    });

    it('should decrement the stack length by one', function() {
      chai.expect(stack.length).to.equal(3);
      stack.pop();
      chai.expect(stack.length).to.equal(2);
    });
  });
});
