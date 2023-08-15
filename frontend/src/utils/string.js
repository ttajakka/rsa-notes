/* global BigInt */

import { bigIntPow } from './crypto'

export const isAscii = (str) => /^[\x20-\x7E]*$/.test(str)

export const toPlainBlocks = (str) => {
  // convert to ASCII hex codes
  let hexrep = ''
  for (let i = 0; i < str.length; i++) {
    hexrep += str.charCodeAt(i).toString(16)
  }

  // pad with zeroes at the end
  const tailLength = hexrep.length % 16
  if (tailLength) {
    for (let i = 0; i < 16 - tailLength; i++) hexrep += '0'
  }

  // split into blocks of 16 characters
  const blocks = []
  const blockCount = hexrep.length / 16
  for (let i = 0; i < blockCount; i++) {
    blocks.push(hexrep.substring(16 * i, 16 * i + 16))
  }
  return blocks
}

export const parsePlainBlocks = (blocks) => {
  const hexstr = blocks.join('')
  let message = ''
  for (let i = 0; i < hexstr.length / 2; i++) {
    const code = hexstr.substring(2 * i, 2 * i + 2)
    if (code === '00') break
    message += String.fromCharCode(parseInt(code, 16))
  }
  return message
}

const splitString = (str) => {
  const output = []
  while (str.length > 0) {
    output.push(str.substring(0, 10))
    str = str.substring(10)
  }
  return output
}

export const wordToBase95 = (word) => {
  let num = BigInt(0)
  for (let i = 0; i < word.length; i++) {
    // num += BigInt(word.charCodeAt(i) - 32) * BigInt(95) ** BigInt(i)
    num += BigInt(word.charCodeAt(i) - 32) * bigIntPow(95, i)
  }
  return num
}

export const strToBase95 = (str) => {
  return splitString(str).map(w => wordToBase95(w))
}

export const parseWordFromBase95 = (input) => {
  input = BigInt(input)
  let output = ''
  while (input > 0) {
    output += String.fromCharCode(Number(input % BigInt(95)) + 32)
    input = input / BigInt(95)
  }
  return output
}

export const base95ToStr = (input) => {
  let output = ''
  for (let i in input) {
    output += parseWordFromBase95(input[i])
  }
  return output
}
