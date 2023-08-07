console.log('Starting string method dev file')


let str = ''
for (let i = 0; i < 128; i++) {
  str += String.fromCharCode(i + 33) + ' '
}
console.log(str)

const isAscii = str => /^[\x00-\x7F]+$/.test(str);

console.log(isAscii('aa'))
console.log(isAscii('ää'))