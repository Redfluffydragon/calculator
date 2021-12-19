const mapdiv = document.getElementById('mapper');

const mapIn = mapdiv.getElementsByTagName('input');
let mapVals = {
  value: 0,
  r11: 0,
  r12: 0,
  r21: 0,
  r22: 0,
};
const mapAIn = document.getElementById('mapAIn');

const baIn = document.getElementById('bitand').getElementsByTagName('input');
const boIn = document.getElementById('bitor').getElementsByTagName('input');

const calcscreen = document.getElementById('calcscreen');
let calculation = [];
let circMode = 'rad';

const baselectOut = document.getElementById('baselectOut');
const baselectIn = document.getElementById('baselectIn');
const convIn = document.getElementById('baseconv').getElementsByTagName('input');

function map() {
  //6, 0, 255, 1000, 2000
  let mapKeys = Object.keys(mapVals); //get the keys for the mapping values
  //put values into the mapVals object
  if (mapAIn.value !== '') { //for one input
    for (let i = 0; i < mapKeys.length; i++) mapVals[mapKeys[i]] = parseFloat(mapAIn.value.split(',')[i]);
  }
  else { //for multiple inputs
    for (let i = 1; i < mapKeys.length; i++) mapVals[mapKeys[i]] = parseFloat(mapIn[i].value);
  }
  console.log(mapVals);
  //map the value (only works with ascending range values currently)
  percent = (mapVals.value - mapVals.r11)/(mapVals.r12 - mapVals.r11);
  mapped = (percent*(mapVals.r22 - mapVals.r21)) + mapVals.r21;
  mapIn[6].value = mapped; //output the new value
}

function bitand() {
  let out = baIn[0].value & baIn[1].value;
  baIn[2].value = out;
  baIn[3].value = out.toString(2); //in binary
}
function bitor() {
  let out = boIn[0].value | boIn[1].value;
  boIn[2].value = out;
  boIn[3].value = out.toString(2);
}

const bases = { //for converting base names into radix numbers
  Binary: 2,
  Ternary: 3,
  Quaternary: 4,
  Quinary: 5,
  Seximal: 6,
  Septimal: 7,
  Octal: 8,
  Nonary: 9,
  Decimal: 10,
  Elevenary: 11,
  Dozenary: 12,
  Hexadecimal: 16,
}

function convert() { //parseFloat doesn't work here - fix with * and / ?
  if (convIn[0].value !== '') {
    convIn[1].value = parseInt(convIn[0].value, bases[baselectIn.value]).toString(bases[baselectOut.value]);
  }
}

const replacers = [
  ['π', Math.PI], 
  [/sin/i, 'Math.sin'], //fix deg/rad when typing in 'sin' or whatever - (regex?)
  [/cos/i, 'Math.cos'], 
  [/tan/i, 'Math.tan'], 
  ['−', '-'], 
  ['×', '*'],
  ['÷', '/'],
  ['√', 'Math.sqrt'],
]

function evaluate() {
  for (let i in replacers) {
    calcscreen.value = calcscreen.value.replace(replacers[i][0], replacers[i][1]);
  }
  for (let j in calculation) {
    for (let i in replacers) {
      calculation[j] = calculation[j].replace(replacers[i][0], replacers[i][1]);
    }
  }
  calcscreen.value = eval(calculation.join(''));
}

document.addEventListener('click', e => { //listening on the calculate/convert buttons
  const match = t => e.target.matches(t)
  if (match('#mapbtn')) {
    map();
  }
  else if (match('#babtn')) {
    bitand();
  }
  else if (match('#bobtn')) {
    bitor();
  }
  else if (match('#convbtn')) {
    convert();
  }
  if (e.target.closest('button') && e.target.closest('#scicalc')) {
    let c = e.target.textContent;
    if (Object.keys(clearOperations).includes(c)) {
      if (isNaN(calculation[calculation.length-1]) && calcscreen.value === '') {
        calculation.splice(calculation.length-1, 1);
        clearOperations[c]();
        calcscreen.value = '';
        calcscreen.focus();
      }
    }
    if (calcscreen.value !== '') {
      if (calculation.length) {
        if (!isNaN(calculation[calculation.length-1]) && !isNaN(calcscreen.value)) {
          calculation.length = 0;
        }
      }

      calculation.push(calcscreen.value);
      console.log(calculation);


      if (Object.keys(clearOperations).includes(c)) {
        clearOperations[c]();
        calcscreen.value = '';
      }
      else if (Object.keys(inOperations).includes(c)) {
        inOperations[c]();
      }
      else if (c === '=') {
        evaluate();
      }
      calcscreen.focus();
    }
    if (c === 'deg' || c === 'rad') {
      e.target.textContent = circMode === 'rad' ? 'deg' : 'rad';
      circMode = circMode === 'rad' ? 'deg' : 'rad';
    }
  }
}, false);

document.addEventListener('keydown', e => { //listen for ENTER, which function decided by focused element
  const elMatch = t => document.activeElement.closest(t)
  if (e.keyCode === 13) {
    if (elMatch('#mapper')) {
      map();
    }
    else if (elMatch('#bitand')) {
      bitand();
    }
    else if (elMatch('#bitor')) {
      bitor();
    }
    else if (elMatch('#scicalc')) {
      calculation.push(calcscreen.value);
      evaluate();     
    }
    else if (elMatch('#baseconv')) {
      convert();
    }
  }
}, false);

//calculator
const clearOperations = { //operations where the input field is cleared
  'c': () => {},
  'ac': () => { calculation.length = 0; },
  '+': () => { calculation.push('+'); },
  '−': () => { calculation.push('-'); },
  '×': () => { calculation.push('*'); },
  '÷': () => { calculation.push('/'); },
}

const inOperations = { //operations where the input field is not cleared - they happen "in place"
  '√': () => {
    calcscreen.value = Math.sqrt(parseFloat(calcscreen.value));
  },
  'x2': () => {
    calcscreen.value = parseFloat(calcscreen.value * calcscreen.value);
  },
  'xn': () => {},
  '⇧': () => {},
  'sin': () => {
    let val = circMode === 'rad' ? parseFloat(calcscreen.value) : (parseFloat(calcscreen.value)/360)*(Math.PI*2)
    calcscreen.value = Math.sin(val);
  },
  'cos': () => {
    let val = circMode === 'rad' ? parseFloat(calcscreen.value) : (parseFloat(calcscreen.value)/360)*(Math.PI*2)
    calcscreen.value = Math.cos(val);
  },
  'tan': () => {
    let val = circMode === 'rad' ? parseFloat(calcscreen.value) : (parseFloat(calcscreen.value)/360)*(Math.PI*2)
    calcscreen.value = Math.tan(val);
  },
  '': () => {},
}

calcscreen.addEventListener('input', e => { //replace with fancier characters while inputting
  let replace;
  if (e.data === '*') {
    replace = '×';
  }
  else if (e.data === '/') {
    replace = '÷';
  }
  else if (e.data === '-') {
    replace = '−';
  }
  if (replace) calcscreen.value = (calcscreen.value.slice(0, -1)) + replace;

  calcscreen.value = calcscreen.value.replace(/sqrt/i, '√');
  calcscreen.value = calcscreen.value.replace(/pi/i, 'π');
}, false);