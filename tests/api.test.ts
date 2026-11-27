import test from "node:test";
import assert from "node:assert";

// Polyfill window, localStorage, and sessionStorage for Node.js test environment
class MockStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockLocal = new MockStorage();
const mockSession = new MockStorage();

(globalThis as any).window = globalThis;
(globalThis as any).dispatchEvent = () => true;
(globalThis as any).Event = class Event {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
};
(globalThis as any).localStorage = mockLocal;
(globalThis as any).sessionStorage = mockSession;

// Import the module under test
import {
  toPaise,
  toRupees,
  formatINR,
  getTenantSlug,
  setTenantSlug,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
} from "../lib/api.ts";

test("toPaise: converts rupees string and numbers to strict integer paise", () => {
  assert.strictEqual(toPaise("100"), 10000);
  assert.strictEqual(toPaise("100.50"), 10050);
  assert.strictEqual(toPaise(100.5), 10050);
  assert.strictEqual(toPaise("0.05"), 5);
  assert.strictEqual(toPaise("0"), 0);
  assert.strictEqual(toPaise(""), 0);
  assert.strictEqual(toPaise("invalid"), 0);
  // Rounding check
  assert.strictEqual(toPaise(49.999), 5000);
});

test("toRupees: converts paise integers to decimal rupees", () => {
  assert.strictEqual(toRupees(10050), 100.5);
  assert.strictEqual(toRupees(0), 0);
  assert.strictEqual(toRupees(5), 0.05);
  assert.strictEqual(toRupees(10000000), 100000);
});

test("formatINR: formats integer paise into Indian currency representation", () => {
  const formattedLakh = formatINR(10000000); // ₹1,00,000.00
  assert.match(formattedLakh, /1,00,000/);

  const formattedSmall = formatINR(25050); // ₹250.50
  assert.match(formattedSmall, /250\.50/);
});

test("getTenantSlug & setTenantSlug: isolates and validates institutional tenants", () => {
  mockLocal.clear();
  mockSession.clear();

  // Default fallback is public
  assert.strictEqual(getTenantSlug(), "public");

  // Valid college tenants
  setTenantSlug("navkis");
  assert.strictEqual(getTenantSlug(), "navkis");

  setTenantSlug("rvce");
  assert.strictEqual(getTenantSlug(), "rvce");

  setTenantSlug("PUBLIC");
  assert.strictEqual(getTenantSlug(), "public");

  // Invalid tenant reverts to public
  mockLocal.setItem("finsmart_tenant", "malicious_tenant");
  assert.strictEqual(getTenantSlug(), "public");
});

test("setStoredAuth & clearStoredAuth: manages session persistence and cache purging", () => {
  mockLocal.clear();
  mockSession.clear();

  const testUser = {
    user_id: "user-123",
    email: "student@navkis.edu",
    role: "student",
  };

  // 1. Remember Me = true writes to both localStorage and sessionStorage
  setStoredAuth({ access_token: "jwt-token-abc", user: testUser }, true);
  assert.strictEqual(getStoredToken(), "jwt-token-abc");
  assert.deepStrictEqual(getStoredUser(), testUser);
  assert.strictEqual(mockLocal.getItem("finsmart_token"), "jwt-token-abc");
  assert.strictEqual(mockSession.getItem("finsmart_token"), "jwt-token-abc");

  // 2. Remember Me = false writes to sessionStorage only
  setStoredAuth({ access_token: "jwt-token-session-only", user: testUser }, false);
  assert.strictEqual(mockSession.getItem("finsmart_token"), "jwt-token-session-only");
  assert.strictEqual(mockLocal.getItem("finsmart_token"), null);

  // 3. Clear auth purges both stores
  clearStoredAuth();
  assert.strictEqual(getStoredToken(), null);
  assert.strictEqual(getStoredUser(), null);
  assert.strictEqual(mockLocal.getItem("finsmart_token"), null);
  assert.strictEqual(mockSession.getItem("finsmart_token"), null);
});
