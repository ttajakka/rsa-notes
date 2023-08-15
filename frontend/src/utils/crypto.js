/* global BigInt */

// implements fast powering algorithm for exponentiating BigInt's, since
// BigInt(a) ** BigInt(b) seems to not work sometimes.
export const bigIntPow = (b, x) => {
  if (x < 0) console.error('exponent must be nonnegative')
  b = BigInt(b)
  x = BigInt(x)
  let res = BigInt(1)
  while (x) {
    if (x % BigInt(2)) {
      res = res * b
      x = (x - BigInt(1)) / BigInt(2)
    } else {
      x = x / BigInt(2)
    }
    b = (b * b)
  }
  return res
}

// We choose MIN = 95^5 and MAX = 9*95^5 so that the product p*q of
// any two integers MIN < p, q < MAX has exactly 11
// digits in base 95

// const MIN = BigInt(95) * BigInt(95) * BigInt(95) * BigInt(95) * BigInt(95)
// const MIN = BigInt(95) ** BigInt(5)
const MIN = bigIntPow(95, 5)
const MAX = MIN * BigInt(9)

const randomOdd = (min, max) => {
  min = BigInt(min); max = BigInt(max)
  if (min % BigInt(2) === BigInt(0)) min = min + BigInt(1)
  return BigInt(Number(min) + 2 * Math.floor(Math.random() * (Number(max - min) / 2)))
}

const GCD = (x, y) => {
  x = BigInt(x)
  y = BigInt(y)
  while (y) {
    let t = y
    y = x % y
    x = t
  }
  return x
}

const ExtEuclid = (a, b) => {
  let r0 = BigInt(a)
  let r1 = BigInt(b)
  let s0 = BigInt(1),
    s1 = BigInt(0),
    t0 = BigInt(0),
    t1 = BigInt(1)
  for (;;) {
    let r2 = r0 % r1
    if (!r2) {
      return [r1, s1, t1]
    }
    let q1 = (r0 - r2) / r1
    let s2 = s0 - q1 * s1
    let t2 = t0 - q1 * t1
    r0 = r1
    r1 = r2
    s0 = s1
    s1 = s2
    t0 = t1
    t1 = t2
  }
}

// returns b^x mod n
const pow = (b, x, n) => {
  if (x <= 0) console.error('exponent must be positive')
  b = BigInt(b)
  n = BigInt(n)
  x = BigInt(x)
  let res = BigInt(1)
  while (x) {
    if (x % BigInt(2)) {
      res = (res * b) % n
      x = (x - BigInt(1)) / BigInt(2)
    } else {
      x = x / BigInt(2)
    }
    b = (b * b) % n
  }
  return res
}

// returns [k, q], where n = 2^k * q
const evenAndOddParts = (n) => {
  n = BigInt(n)
  let k = BigInt(0)
  while (n % BigInt(2) === BigInt(0)) {
    k = k + BigInt(1)
    n = n / BigInt(2)
  }
  return [k, n]
}

// determines whether a is a Miller-Rabin witness for n
const millerRabin = (n, a) => {
  n = BigInt(n)
  a = BigInt(a)
  if (n % BigInt(2) === BigInt(0)) return true
  if (GCD(a, n) > BigInt(1)) return true
  let [k, q] = evenAndOddParts(n - BigInt(1))
  a = pow(a, q, n)
  if (a === BigInt(1)) return false
  for (let i = 0; i < k; i++) {
    if (a === n - BigInt(1)) return false
    a = pow(a, 2, n)
    if (a === n) return true
  }
  return true
}

// probabilistically test whether n is a prime
// by running Miller-Rabin with 20 randomly selected candidate witnesses
const testPrimality = (n) => {
  if (n === BigInt(2)) return true
  for (let i = 0; i < 20; i++) {
    const a = BigInt(Math.floor(Math.random() * (Number(n) - 2)) + 2)
    if (millerRabin(n, a)) return false
  }
  return true
}

// outputs a (probable) prime between MIN and MAX defined above
const createPrime = () => {
  for (;;) {
    const a = randomOdd(MIN, MAX)
    if (testPrimality(a)) return a
  }
}

// outputs distinct primes p and q, both between MIN and MAX, with the
// property that (p-1)(q-1) is not divisible by 3
export const createPrivateKey = () => {
  for (;;) {
    const p = createPrime()
    const q = createPrime()
    if (p !== q && ((p - BigInt(1)) * (q - BigInt(1))) % BigInt(3))
      return [p, q]
  }
}

// outputs the RSA encryption of the message m using
// public key N and encryption exponent 3
export const encrypt = (m, N) => {
  return pow(m, 3, N)
}

// outputs the RSA decryption of the ciphertext c assuming
// it was encrypted with public key N = pq and encryption exponent 3
export const decrypt = (c, p, q) => {
  p = BigInt(p); q = BigInt(q)
  let [, , d] = ExtEuclid((p - BigInt(1)) * (q - BigInt(1)), 3)
  while (d < 0) d = d + (p - BigInt(1)) * (q - BigInt(1))
  return pow(c, d, p * q)
}
