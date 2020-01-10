import { CircularlyLinkedList } from 'ads';
import { Position } from 'src/position.class';
import * as chai from 'chai';

describe('CircularlyLinkedList', function() {
  const anotherList = new CircularlyLinkedList(['some element']);
  let list: CircularlyLinkedList<string>;

  beforeEach(() => {
    list = new CircularlyLinkedList(['foo', 'bar', 'baz']);
  });

  describe('constructor()', function() {
    it('should create a linked list without elements', function() {
      list = new CircularlyLinkedList();
      chai.expect(list.length).to.equal(0);
    });
  });

  describe('addAfter()', function() {
    it('should insert element after the specified position in the list', function() {
      const position = list.addAfter(list.getCurrent()!, 'added element');

      chai.expect(list.getAfter(position)!.element).to.equal('bar');
      chai.expect(list.getAfter(list.getCurrent()!)!.element).to.equal('added element');
    });

    it('should return position of the added element', function() {
      const position = list.addAfter(list.getCurrent()!, 'added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should link back with front on adding after the current back', function() {
      list.addAfter(list.getLast()!, 'added element');
      chai.expect(list.getAfter(list.getLast()!).element).to.equal(list.getCurrent()!.element);
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.addAfter.bind(list, anotherList.getCurrent()!, 'added element')).to
        .throw('Position does not belong to this list');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = list.getLast()!;

      list.clear();
      chai.expect(list.addAfter.bind(list, position, 'added element')).to.throw('Position is deprecated');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addAfter(list.getCurrent()!, 'added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('addCurrent()', function() {
    it('should prepend element to the list', function() {
      list.addCurrent('added element');
      chai.expect(list.getCurrent()!.element).to.equal('added element');
      chai.expect(list.getAfter(list.getCurrent()!)!.element).to.equal('foo');
    });

    it('should init circular relation if the list is empty', function() {
      list.clear();
      list.addCurrent('added element');
      chai.expect(list.getAfter(list.getCurrent()!).element)
        .to.equal(list.getCurrent()!.element).and.to.equal('added element');
    });

    it('should return position of the added element', function() {
      const position = list.addCurrent('added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should link back with front', function() {
      list.addAfter(list.getLast()!, 'added element');
      chai.expect(list.getAfter(list.getLast()!).element).to.equal(list.getCurrent()!.element);
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addCurrent('added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('clear()', function() {
    it('should clear the list', function() {
      list.clear();
      chai.expect(list.getCurrent()).to.be.undefined;
      chai.expect(Array.from(list).length).to.equal(0);
    });

    it('should not deprecate existing positions if instant is TRUE', function() {
      const position = list.getCurrent();
      const positionAfter = list.getAfter(position!);

      list.clear(true);
      chai.expect(list.getAfter(position!).element).to.equal(positionAfter.element);
    });

    it('should deprecate existing positions if instant is FALSE', function() {
      const position = list.getCurrent();

      list.clear();
      chai.expect(list.getAfter.bind(list, position!)).to.throw('Position is deprecated');
    });

    it('should reduce the list length to 0', function() {
      chai.expect(list.length).to.equal(3);
      list.clear();
      chai.expect(list.length).to.equal(0);
    });
  });

  describe('getAfter()', function() {
    it('should return current front element after the current back', function() {
      chai.expect(list.getAfter(list.getLast()!)!.element).to.equal(list.getCurrent()!.element);
    });

    it('should return position of the element after the specified position', function() {
      chai.expect(list.getAfter(list.getCurrent()!)).to.be.instanceOf(Position);
      chai.expect(list.getAfter(list.getCurrent()!)!.element).to.equal('bar');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.getAfter.bind(list, anotherList.getCurrent()!)).to
        .throw('Position does not belong to this list');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = list.getCurrent()!;

      list.clear();
      chai.expect(list.getAfter.bind(list, position, 'added element')).to.throw('Position is deprecated');
    });
  });

  describe('getCurrent()', function() {
    it('should return undefined if the list is empty', function() {
      list.clear();
      chai.expect(list.getCurrent()).to.be.undefined;
    });

    it('should return position of the current front element in the list', function() {
      chai.expect(list.getCurrent()).to.be.instanceOf(Position);
      chai.expect(list.getCurrent()!.element).to.equal('foo');
    });

    it('should return the same as previous() if the list has one element', function() {
      list = new CircularlyLinkedList(['foo']);
      chai.expect(list.getCurrent()!.element).to.equal(list.getLast()!.element);
    });
  });

  describe('previous()', function() {
    it('should return undefined if the list is empty', function() {
      list.clear();
      chai.expect(list.getLast()).to.be.undefined;
    });

    it('should return position of the current back element in the list', function() {
      chai.expect(list.getLast()).to.be.instanceOf(Position);
      chai.expect(list.getLast()!.element).to.equal('baz');
    });

    it('should return the same as current() if the list has one element', function() {
      list = new CircularlyLinkedList(['foo']);
      chai.expect(list.getLast()!.element).to.equal(list.getCurrent()!.element);
    });
  });

  describe('length', function() {
    it('should return count of elements in the list', function() {
      chai.expect(list.length).to.equal(3);
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the list is empty', function() {
      list.clear();
      chai.expect(list.isEmpty()).to.equal(true);
    });

    it('should return false if the list has elements', function() {
      chai.expect(list.isEmpty()).to.equal(false);
    });
  });

  describe('removeCurrent()', function() {
    it('should throw if the list is empty', function() {
      list.clear();
      chai.expect(list.removeCurrent.bind(list)).to.throw('List is empty');
    });

    it('should remove and return the current front element from the list', function() {
      chai.expect(list.removeCurrent()).to.equal('foo');
    });

    it('should current() and previous() point to the same if one element is left after removing', function() {
      list.removeCurrent();
      list.removeCurrent();
      chai.expect(list.getCurrent()!.element).to.equal(list.getLast()!.element);
    });

    it('should decrement the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.removeCurrent();
      chai.expect(list.length).to.equal(2);
    });

    it('should return undefined on current() and previous() if the list is empty after removing', function() {
      list.removeCurrent();
      list.removeCurrent();
      list.removeCurrent();
      chai.expect(list.getCurrent()).to.equal(list.getLast()).and.to.be.undefined;
    });

    it('should deprecate the removed node', function() {
      const position = list.getCurrent();

      list.removeCurrent();
      chai.expect(list.getAfter.bind(list, position!)).to.throw('Position is deprecated');
    });
  });

  describe('replace()', function() {
    it('should replace element at the specified position in the list', function() {
      list.replace(list.getCurrent()!, 'replacement');
      chai.expect(list.getCurrent()!.element).to.equal('replacement');
    });

    it('should return the replaced element', function() {
      chai.expect(list.replace(list.getCurrent()!, 'replacement')).to.equal('foo');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.replace.bind(list, anotherList.getCurrent()!, 'replacement')).to
        .throw('Position does not belong to this list');
    });

    it('should throw if the specified position is deprecated', function() {
      const position = list.getCurrent()!;

      list.clear();
      chai.expect(list.replace.bind(list, position, 'added element')).to.throw('Position is deprecated');
    });

    it('should not change the list length', function() {
      chai.expect(list.length).to.equal(3);
      list.replace(list.getCurrent()!, 'replacement');
      chai.expect(list.length).to.equal(3);
    });
  });

  describe('rotate()', function() {
    it('should move current pointer to the element after the current', function() {
      list.rotate();
      chai.expect(list.getCurrent()!.element).to.equal('bar');
    });

    it('should not fail if the list is empty', function() {
      list.clear();
      list.rotate();
      chai.expect(list.getCurrent()).to.be.undefined;
    });
  });

  describe('iterator', function() {
    it('should iterate through all values from the list', function() {
      chai.expect(Array.from(list)).to.eql(['foo', 'bar', 'baz']);
    });
  });
});
