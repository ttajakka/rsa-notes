console.log('Starting crypto module')

const MIN = parseInt('1000000', 16)
const MAX = parseInt('FFFFFFF', 16)

const randomOdd = (min, max) => {
  if (min % 2 === 0) min = min + 1
  return BigInt(min + 2 * Math.floor(Math.random() * ((max - min) / 2)))
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
  r0 = BigInt(a)
  r1 = BigInt(b)
  let s0 = BigInt(1),
    s1 = BigInt(0),
    t0 = BigInt(0),
    t1 = BigInt(1)
  while (true) {
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

// for (let i = 0; i < 10; i++) {
//   let a = randomOdd(MIN, MAX)+BigInt(1),
//     b = randomOdd(MIN, MAX)+BigInt(1)
//   let [r, s, t] = ExtEuclid(a, b)
//   console.log(
//     `GCD(${a}, ${b}) = ${GCD(a, b)} = ${r} = ${a}*${s} + ${b}*${t} = ${
//       a * s + b * t
//     }`
//   )
// }

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
  while (true) {
    const a = randomOdd(MIN, MAX)
    if (testPrimality(a)) return a
  }
}

// outputs distinct primes p and q, both between MIN and MAX, with the
// property that (p-1)(q-1) is not divisible by 3
const createPrivateKey = () => {
  while (true) {
    const p = createPrime()
    const q = createPrime()
    if (p !== q && ((p - BigInt(1)) * (q - BigInt(1))) % BigInt(3))
      return [p, q]
  }
}

// outputs the RSA encryption of the message m using
// public key N and encryption exponent 3
const encrypt = (m, N) => {
  return pow(m, 3, N)
}

// for (let i = 0; i < 10; i++) {
//   const [p, q] = createPrivateKey()
//   const N = p*q
//   const m = Math.floor(Math.random()*N)
//   console.log(`message: ${m}, encryption: ${encrypt(m, N)}`)
// }

// outputs the RSA decryption of the ciphertext c assuming
// it was encrypted with public key N = pq and encryption exponent 3
const decrypt = (c, p, q) => {
  let [r, s, d] = ExtEuclid((p - BigInt(1)) * (q - BigInt(1)), 3)
  while (d < 0) d = d + (p - BigInt(1)) * (q - BigInt(1))
  return pow(c, d, p * q)
}

for (let i = 0; i < 10; i++) {
  const [p, q] = createPrivateKey()
  const N = p * q
  const m = Math.floor(Math.random() * Number(N))
  const c = encrypt(m, N)
  const m2 = decrypt(c, p, q)
  console.log(
    `message: ${m.toString(16)}, encryption: ${encrypt(m, N).toString(16)}, decryption: ${m2.toString(16)}, correct? ${
      BigInt(m) === BigInt(m2)
    }`
  )
}

// for (let i = 100; i < 200; i++) {
//   if (testPrimality(i)) console.log(i)
// }

// console.log(millerRabin(BigInt(172947529),BigInt(17)))
// console.log(millerRabin(172947529, 3))
// console.log(millerRabin(172947529, 23))

// const n = 118915387
// console.log(`testing for primality of ${n}`)

// let j = 0
// for (let i = 0; i < 10000000; i++) {
//   const a = Math.floor(Math.random()*n)
//   if (a < 2) continue
//   console.log(`is ${a} a Miller-Rabin witness for ${n}?`, millerRabin(n, a))
//   if (millerRabin(n, a)) j += 1
// }
// console.log(`found ${j} witnesses for ${n}`)

// for (let i = 0; i < 100; i++) {
//   console.log(createPrime(MIN, MAX).toString(16).toUpperCase())
// }

//
