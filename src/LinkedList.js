export default class LinkedList {
  constructor() {
    this.headNode = null;
  }

  append(value) {
    const node = new Node(value);

    if (this.headNode === null) {
      this.headNode = node;
      return;
    }
    let curr = this.headNode;
    while (curr.nextNode !== null) {
      curr = curr.nextNode;
    }
    curr.nextNode = node;
  }

  prepend(value) {
    this.headNode = new Node(value, this.headNode);
  }

  size() {
    let size = 0;
    let curr = this.headNode;

    while (curr !== null) {
      size++;
      curr = curr.nextNode;
    }
    return size;
  }

  head() {
    return this.headNode?.value;
  }

  tail() {
    if (this.headNode === null) {
      return undefined;
    }

    let curr = this.headNode;
    while (curr.nextNode !== null) {
      curr = curr.nextNode;
    }
    return curr.value;
  }

  at(index) {
    if (index < 0) {
      return undefined;
    }
    let curr = this.headNode;
    let i = 0;

    while (curr !== null) {
      if (i === index) {
        return curr.value;
      }
      curr = curr.nextNode;
      i++;
    }
    return undefined;
  }

  pop() {
    if (this.headNode === null) {
      return undefined;
    }
    const value = this.headNode.value;
    this.headNode = this.headNode.nextNode;
    return value;
  }

  contains(value) {
    let curr = this.headNode;
    while (curr !== null) {
      if (curr.value === value) {
        return true;
      }
      curr = curr.nextNode;
    }
    return false;
  }

  findIndex(value) {
    let curr = this.headNode;
    let index = 0;

    while (curr !== null) {
      if (curr.value === value) {
        return index;
      }
      curr = curr.nextNode;
      index++;
    }
    return -1;
  }

  toString() {
    if (this.headNode === null) {
      return "";
    }
    const arr = [];
    let curr = this.headNode;

    while (curr !== null) {
      arr.push(`( ${curr.value} )`);
      curr = curr.nextNode;
    }
    arr.push("null");
    return arr.join(" -> ");
  }

  insertAt(index, ...values) {
    if (index < 0) {
      throw new RangeError("Negative index");
    }

    if (values.length === 0) {
      return;
    }

    const nodes = values.map((val) => new Node(val));
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].nextNode = nodes[i + 1];
    }

    if (index === 0) {
      nodes[nodes.length - 1].nextNode = this.headNode;
      this.headNode = nodes[0];
      return;
    }

    let prev = this.headNode;
    let i = 0;

    while (prev !== null && i < index - 1) {
      prev = prev.nextNode;
      i++;
    }

    if (prev === null) {
      throw new RangeError("Index is above list size");
    }

    nodes[nodes.length - 1].nextNode = prev.nextNode;
    prev.nextNode = nodes[0];
  }

  removeAt(index) {
    if (index < 0 || this.headNode === null) {
      throw new RangeError("Index out of bounds");
    }
    let targetNode;
    if (index === 0) {
      targetNode = this.headNode;
      this.headNode = this.headNode.nextNode;
      targetNode.nextNode = null;

      return;
    }

    let prev = this.headNode;
    let i = 0;

    while (prev !== null && i < index - 1) {
      prev = prev.nextNode;
      i++;
    }

    if (prev === null || prev.nextNode === null) {
      throw new RangeError("Index out of bounds");
    }

    targetNode = prev.nextNode;
    prev.nextNode = prev.nextNode.nextNode;
    targetNode.nextNode = null;
  }
}

class Node {
  constructor(value = null, nextNode = null) {
    this.value = value;
    this.nextNode = nextNode;
  }
}
