import HashMap from "./HashMap";

let hashMap;
beforeEach(() => {
  hashMap = new HashMap();
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
