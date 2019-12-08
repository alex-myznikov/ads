import { Position } from 'src/position.class';
import { SinglyLinkedList } from 'ads';
import * as chai from 'chai';

describe('SinglyLinkedList', function() {
  const anotherList = new SinglyLinkedList(['some element']);
  let list: SinglyLinkedList<string>;

  beforeEach(() => {
    list = new SinglyLinkedList(['foo', 'bar', 'baz']);
  });

  describe('constructor()', function() {
    it('should create a linked list without elements', function() {
      list = new SinglyLinkedList();
      chai.expect(list.length).to.equal(0);
    });
  });

  describe('addAfter()', function() {
    it('should insert element after the specified position in the list', function() {
      const position = list.addAfter(list.getFirst()!, 'added element');

      chai.expect(list.after(position)!.element).to.equal('bar');
      chai.expect(list.after(list.getFirst()!)!.element).to.equal('added element');
    });

    it('should return position of the added element', function() {
      const position = list.addAfter(list.getFirst()!, 'added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.addAfter.bind(list, anotherList.getFirst()!, 'added element')).to
        .throw('Position does not belong to this list');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addAfter(list.getFirst()!, 'added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('addFirst()', function() {
    it('should prepend element to the list', function() {
      list.addFirst('added element');
      chai.expect(list.getFirst()!.element).to.equal('added element');
      chai.expect(list.after(list.getFirst()!)!.element).to.equal('foo');
    });

    it('should init both head and tail if the list is empty', function() {
      list.clear();
      list.addFirst('added element');
      chai.expect(list.getFirst()!.element).to.equal(list.getLast()!.element);
    });

    it('should return position of the added element', function() {
      const position = list.addFirst('added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addFirst('added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('addLast()', function() {
    it('should append element to the list', function() {
      list.addLast('added element');
      chai.expect(list.getLast()!.element).to.equal('added element');
    });

    it('should init both head and tail if the list is empty', function() {
      list.clear();
      list.addLast('added element');
      chai.expect(list.getFirst()!.element).to.equal(list.getLast()!.element);
    });

    it('should return position of the added element', function() {
      const position = list.addLast('added element');

      chai.expect(position).to.be.instanceOf(Position);
      chai.expect(position.element).to.equal('added element');
    });

    it('should increment the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.addLast('added element');
      chai.expect(list.length).to.equal(4);
    });
  });

  describe('after()', function() {
    it('should return undefined if there is no element after the position', function() {
      chai.expect(list.after(list.getLast()!)).to.be.undefined;
    });

    it('should return position of the element after the specified position', function() {
      chai.expect(list.after(list.getFirst()!)).to.be.instanceOf(Position);
      chai.expect(list.after(list.getFirst()!)!.element).to.equal('bar');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.after.bind(list, anotherList.getFirst()!)).to.throw('Position does not belong to this list');
    });
  });

  describe('clear()', function() {
    it('should clear the list', function() {
      list.clear();
      chai.expect(list.getFirst()).to.be.undefined;
      chai.expect(list.getLast()).to.be.undefined;
      chai.expect(Array.from(list).length).to.equal(0);
    });

    it('should not deprecate existing positions if instant is TRUE', function() {
      const position = list.getFirst();
      const positionAfter = list.after(position!);

      list.clear(true);
      chai.expect(list.after(position!)!.element).to.equal(positionAfter!.element);
    });

    it('should deprecate existing positions if instant is FALSE', function() {
      const position = list.getFirst();

      list.clear();
      chai.expect(list.after.bind(list, position!)).to.throw('Position is deprecated');
    });

    it('should reduce the list length to 0', function() {
      chai.expect(list.length).to.equal(3);
      list.clear();
      chai.expect(list.length).to.equal(0);
    });
  });

  describe('length', function() {
    it('should return count of elements in the list', function() {
      chai.expect(list.length).to.equal(3);
    });
  });

  describe('getFirst()', function() {
    it('should return undefined if the list is empty', function() {
      list.clear();
      chai.expect(list.getFirst()).to.be.undefined;
    });

    it('should return position of the first element in the list', function() {
      chai.expect(list.getFirst()).to.be.instanceOf(Position);
      chai.expect(list.getFirst()!.element).to.equal('foo');
    });

    it('should return the same as getLast() if the list has one element', function() {
      list = new SinglyLinkedList(['foo']);
      chai.expect(list.getFirst()!.element).to.equal(list.getLast()!.element);
    });
  });

  describe('getLast()', function() {
    it('should return undefined if the list is empty', function() {
      list.clear();
      chai.expect(list.getLast()).to.be.undefined;
    });

    it('should return position of the last element in the list', function() {
      chai.expect(list.getLast()).to.be.instanceOf(Position);
      chai.expect(list.getLast()!.element).to.equal('baz');
    });

    it('should return the same as getFirst() if the list has one element', function() {
      list = new SinglyLinkedList(['foo']);
      chai.expect(list.getLast()!.element).to.equal(list.getFirst()!.element);
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

  describe('removeFirst()', function() {
    it('should throw if the list is empty', function() {
      list.clear();
      chai.expect(list.removeFirst.bind(list)).to.throw('List is empty');
    });

    it('should remove and return the first element from the list', function() {
      chai.expect(list.removeFirst()).to.equal('foo');
    });

    it('should getFirst() and getLast() point to the same if one element is left after removing', function() {
      list.removeFirst();
      list.removeFirst();
      chai.expect(list.getFirst()!.element).to.equal(list.getLast()!.element);
    });

    it('should decrement the list length by one', function() {
      chai.expect(list.length).to.equal(3);
      list.removeFirst();
      chai.expect(list.length).to.equal(2);
    });

    it('should return undefined on getFirst() and getLast() if the list is empty after removing', function() {
      list.removeFirst();
      list.removeFirst();
      list.removeFirst();
      chai.expect(list.getFirst()).to.equal(list.getLast()).and.to.be.undefined;
    });

    it('should deprecate the removed node', function() {
      const position = list.getFirst();

      list.removeFirst();
      chai.expect(list.after.bind(list, position!)).to.throw('Position is deprecated');
    });
  });

  describe('replace()', function() {
    it('should replace element at the specified position in the list', function() {
      list.replace(list.getFirst()!, 'replacement');
      chai.expect(list.getFirst()!.element).to.equal('replacement');
    });

    it('should return the replaced element', function() {
      chai.expect(list.replace(list.getFirst()!, 'replacement')).to.equal('foo');
    });

    it('should throw if the specified position does not belong to this list', function() {
      chai.expect(list.replace.bind(list, anotherList.getFirst()!, 'replacement')).to
        .throw('Position does not belong to this list');
    });

    it('should not change the list length', function() {
      chai.expect(list.length).to.equal(3);
      list.replace(list.getFirst()!, 'replacement');
      chai.expect(list.length).to.equal(3);
    });
  });

  describe('iterator', function() {
    it('should iterate through all values from the list', function() {
      chai.expect(Array.from(list)).to.eql(['foo', 'bar', 'baz']);
    });
  });
});
