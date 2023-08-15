console.log('Starting string method dev file')

// let str = ''
// for (let i = 32; i < 127; i++) {
//   str += String.fromCharCode(i) + ' '
// }
// console.log(str)

// const isAscii = str => /^[\x00-\x7F]+$/.test(str);

// console.log(isAscii('aa'))
// console.log(isAscii('ää'))

// console.log('a' + String.fromCharCode(127) + 'b')

// console.log(BigInt(95)**BigInt(10))

let shortString = 'abc'
let testString = 'Hello world! :-)'
let longString =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

const strToBase95 = (str) => {
  const output = []
  while (str.length > 0) {
    const substr = str.substring(0, 10)
    str = str.substring(10)

    let num = BigInt(0)
    for (let i = 0; i < substr.length; i++) {
      num += BigInt(substr.charCodeAt(i) - 32) * BigInt(95) ** BigInt(i)
    }
    output.push(num)
  }
  return output
}

const parseWordFromBase95 = (input) => {
  input = BigInt(input)
  let output = ''
  while (input > 0) {
    output += String.fromCharCode(Number(input % BigInt(95)) + 32)
    input = input / BigInt(95)
  }
  return output
}

const base95ToStr = (input) => {
  let output = ''
  for (i in input) {
    output += parseWordFromBase95(input[i])
  }
  return output
}

const testEncode = strToBase95(longString)
console.log('encoding:', testEncode)
console.log('decoding:', base95ToStr(testEncode))

console.log(
  parseWordFromBase95(15732772019),
  parseWordFromBase95(10270832711),
  parseWordFromBase95(161588669487450713509)
)
