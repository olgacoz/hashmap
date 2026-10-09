import HashMap from "./HashMap";

let hashMap;
beforeEach(() => {
  hashMap = new HashMap();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("hash module", () => {
  test("order matters", () => {
    expect(hashMap.hash("ab")).not.toBe(hashMap.hash("ba"));
  });

  test.each([
    "Hello",
    "Yo! What's up?",
    "This is a very very veryyy long string",
    "",
    "!@0129u3asdk lqwh!=21++eqjhdsaoijqwe",
    "o",
    "p",
  ])("returns hash code in range [0, capacity) for '%s'", (key) => {
    const index = hashMap.hash(key);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(hashMap.capacity);
  });

  test("hash function is deterministic for the same input", () => {
    expect(hashMap.hash("testKey")).toBe(hashMap.hash("testKey"));
  });
});

describe("set method", () => {
  test("inserts a new key-value pair into an empty bucket", () => {
    hashMap.set("123", "Olgac");

    const index = hashMap.hash("123");
    const bucket = hashMap.buckets[index];

    expect(bucket).toBeDefined();
    expect(bucket.size()).toBe(1);
    expect(bucket.headNode.value).toEqual({
      key: "123",
      value: "Olgac",
    });
  });

  test("updates value when key already exists in bucket", () => {
    hashMap.set("123", "Olgac");
    hashMap.set("123", "Joe");

    const index = hashMap.hash("123");
    const bucket = hashMap.buckets[index];

    expect(bucket.size()).toBe(1);
    expect(bucket.headNode.value).toEqual({
      key: "123",
      value: "Joe",
    });
  });

  test("handles collision by keeping both key-value pairs in the same bucket", () => {
    jest.spyOn(hashMap, "hash").mockReturnValue(3);

    hashMap.set("firstKey", "Value 1");
    hashMap.set("secondKey", "Value 2");

    const bucket = hashMap.buckets[3];

    expect(bucket.size()).toBe(2);

    const nodeValues = [bucket.headNode.value, bucket.headNode.nextNode.value];
    expect(nodeValues).toContainEqual({ key: "firstKey", value: "Value 1" });
    expect(nodeValues).toContainEqual({ key: "secondKey", value: "Value 2" });
  });
});
