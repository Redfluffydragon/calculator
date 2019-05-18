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

function map() {
  //6, 0, 255, 1000, 2000
  let mapKeys = Object.keys(mapVals);
  if (mapAIn.value !== '') {
    for (let i = 0; i < mapKeys.length; i++) mapVals[mapKeys[i]] = parseInt(mapAIn.value.split(',')[i]);
  }
  else {
    for (let i = 1; i < mapKeys.length; i++) mapVals[mapKeys[i]] = parseInt(mapIn[i].value);
  }
  console.log(mapVals);
  percent = (mapVals.value - mapVals.r11)/(mapVals.r12 - mapVals.r11);
  mapped = (percent*(mapVals.r22 - mapVals.r21)) + mapVals.r21;
  mapIn[6].value = mapped;
}

function bitand() {
  let out = baIn[0].value & baIn[1].value;
  baIn[2].value = out;
  baIn[3].value = out.toString(2);
}
function bitor() {
  let out = boIn[0].value | boIn[1].value;
  boIn[2].value = out;
  boIn[3].value = out.toString(2);
}

document.addEventListener('click', e => {
  const match = t => e.target.matches(t)
  if (match('#mapbtn')) {
    map();
  }
  if (match('#babtn')) {
    bitand();
  }
  if (match('#bobtn')) {
    bitor();
  }
}, false);

document.addEventListener('keydown', e => {
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
  }
}, false);