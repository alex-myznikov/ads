import { CircularArrayBuffer } from 'src/queues';
import * as chai from 'chai';

describe('CircularArrayBuffer', function() {
  let buffer: CircularArrayBuffer<number>;

  beforeEach(() => {
    buffer = new CircularArrayBuffer(4, [1, 2, 3]);
  });

  describe('constructor()', function() {
    it('should create a buffer without elements', function() {
      buffer = new CircularArrayBuffer(100); // eslint-disable-line no-undefined
      chai.expect(buffer.length).to.equal(0);
    });
  });

  describe('enqueue()', function() {
    it('should throw if buffer is full and not overwritable', function() {
      buffer.enqueue(4);
      chai.expect(buffer.enqueue.bind(buffer, 5)).to.throw('Buffer is full');
    });

    it('should enqueue element at the rear of the buffer', function() {
      buffer.enqueue(4);
      chai.expect(buffer.dequeue()).to.equal(1);
      buffer.enqueue(5);
      chai.expect(buffer.dequeue()).to.equal(2);
      chai.expect(buffer.dequeue()).to.equal(3);
      chai.expect(buffer.dequeue()).to.equal(4);
      chai.expect(buffer.dequeue()).to.equal(5);
    });

    it('should overwrite values circularly if the buffer is full and overwritable', function() {
      buffer = new CircularArrayBuffer(4, [1, 2, 3], true);

      buffer.enqueue(4);
      buffer.enqueue(5);
      buffer.enqueue(6);
      chai.expect(buffer.dequeue()).to.equal(3);
      chai.expect(buffer.dequeue()).to.equal(4);
      chai.expect(buffer.dequeue()).to.equal(5);
      chai.expect(buffer.dequeue()).to.equal(6);
    });

    it('should increment the buffer length by one', function() {
      chai.expect(buffer.length).to.equal(3);
      buffer.enqueue(4);
      chai.expect(buffer.length).to.equal(4);
    });
  });

  describe('clear()', function() {
    it('should clear the buffer', function() {
      buffer.clear();
      chai.expect(buffer.first.bind(buffer)).to.throw('Buffer is empty');
    });

    it('should reduce the queue length to 0', function() {
      chai.expect(buffer.length).to.equal(3);
      buffer.clear();
      chai.expect(buffer.length).to.equal(0);
    });
  });

  describe('length', function() {
    it('should return count of elements in the buffer', function() {
      chai.expect(buffer.length).to.equal(3);
    });
  });

  describe('maxLength', function() {
    it('should return maximum number of elements the buffer can store before become full', function() {
      chai.expect(buffer.maxLength).to.equal(4);
    });
  });

  describe('first()', function() {
    it('should throw if the buffer is empty', function() {
      buffer.clear();
      chai.expect(buffer.first.bind(buffer)).to.throw('Buffer is empty');
    });

    it('should return the element at the front of the buffer', function() {
      chai.expect(buffer.first()).to.equal(1);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the buffer is empty', function() {
      buffer.clear();
      chai.expect(buffer.isEmpty()).to.be.true;
    });

    it('should return false if the buffer has elements', function() {
      chai.expect(buffer.isEmpty()).to.be.false;
    });
  });

  describe('isFull()', function() {
    it('should return true if the buffer is full', function() {
      buffer.enqueue(4);
      chai.expect(buffer.isFull()).to.be.true;
    });

    it('should return false if the buffer has free slots', function() {
      chai.expect(buffer.isFull()).to.be.false;
    });
  });

  describe('isOverwritable()', function() {
    it('should return true if the buffer is overwritable', function() {
      buffer = new CircularArrayBuffer(0, [], true);
      chai.expect(buffer.isOverwritable()).to.be.true;
    });

    it('should return false if the buffer is not overwritable', function() {
      chai.expect(buffer.isOverwritable()).to.be.false;
    });
  });

  describe('dequeue()', function() {
    it('should throw if the buffer is empty', function() {
      buffer.clear();
      chai.expect(buffer.dequeue.bind(buffer)).to.throw('Buffer is empty');
    });

    it('should remove and return the element from the front of the buffer', function() {
      chai.expect(buffer.dequeue()).to.equal(1);
    });

    it('should decrement the buffer length by one', function() {
      chai.expect(buffer.length).to.equal(3);
      buffer.dequeue();
      chai.expect(buffer.length).to.equal(2);
    });
  });
});
