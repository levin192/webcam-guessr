const unformattedJson = {
  // Your Country Data
  // Use https://gist.github.com/cplpearce/3bc5f1e9b1187df51d2085ffca795bee
}

const notNeeded = [
  'name',
  'alpha-2',
  'alpha-3',
  'country-code',
  'iso_3166-2',
  'region-code',
  'sub-region-code',
  'intermediate-region-code',
  'geonameid',
  'language-codes']
const alphabet = {
  'a': {},
  'b': {},
  'c': {},
  'd': {},
  'e': {},
  'f': {},
  'g': {},
  'h': {},
  'i': {},
  'j': {},
  'k': {},
  'l': {},
  'm': {},
  'n': {},
  'o': {},
  'p': {},
  'q': {},
  'r': {},
  's': {},
  't': {},
  'u': {},
  'v': {},
  'w': {},
  'x': {},
  'y': {},
  'z': {},
}

for (const item in unformattedJson) {
  let c = unformattedJson[item]
  const bb = c['boundingBox']
  bb['sw'] = [bb['sw']['lat'], bb['sw']['lon']]
  bb['ne'] = [bb['ne']['lat'], bb['ne']['lon']]
  notNeeded.forEach(n => {
    delete c[n]
  })
  alphabet[item[0]][item] = c
}

const fs = require('fs')
const path = require('path');

const filePath = path.resolve(__dirname, '') + '/public/data/json/countries/'

fs.mkdirSync(filePath, { recursive: true });

for (const letter in alphabet) {
  const fileName = letter + '.json'
  const fileData = JSON.stringify(alphabet[letter])

  fs.writeFile(filePath + fileName, fileData, 'utf8', function (err) {
    if (err) return console.log(err)
    console.log('>>>')
    console.log('Wrote data to ' + fileName)
    console.log('<<<')
  })
}