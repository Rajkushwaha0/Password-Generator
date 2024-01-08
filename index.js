let inputSlider = document.querySelector("[data-lengthslider]");
let lengthdisplay = document.querySelector("[data-lengthNumber]");
let passworddisplay = document.querySelector("[data-passwordDisplay]");
let indicator = document.querySelector("[data-indicator]");
let allcheckbox = document.querySelectorAll("input[type=checkbox]");

symbols = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "+",
  "{",
  "}",
  ":",
  ";",
  ",",
  "<",
  ">",
  "?",
  "/",
  "[",
  "]",
  '"',
  "_",
  "-",
  "=",
];

var passwordlength = 10;
var checkcount = 0;
handlePassword();
//set strength circle color to grey
setIndicator("#ccc");

//set length
function handlePassword() {
  inputSlider.value = passwordlength;
  lengthdisplay.innerText = passwordlength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordlength - min) * 100) / (max - min) + "% 100%";
}

function handleBoxCount() {
  checkcount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkcount++;
  });

  if (passwordlength < checkcount) {
    passwordlength = checkcount;
    handlePassword();
  }
}

allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleBoxCount);
});

// set indicator
function setIndicator(color) {
  indicator.style.width = "10px";
  indicator.style.height = "10px";
  indicator.style.borderRadius = "50%";
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = "0px 0px 3px " + color;
}

//get randam integer between two number
function getInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
  return getInteger(0, 9);
}

function getLowercase() {
  return String.fromCharCode(getInteger(97, 123));
}

function getUppercase() {
  return String.fromCharCode(getInteger(65, 91));
}

function getSymbols() {
  const index = getInteger(0, 26);
  return symbols[index];
}

let uppercase = document.querySelector("#uppercase");
let lowercase = document.querySelector("#lowercase");
let number = document.querySelector("#number");
let symbol = document.querySelector("#symbols");
function calcStrength() {
  let hasNum = false;
  let hasUpper = false;
  let hasLower = false;
  let hasSymbol = false;
  if (uppercase.checked) hasUpper = true;
  if (lowercase.checked) hasLower = true;
  if (number.checked) hasNum = true;
  if (symbol.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordlength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    passwordlength >= 6 &&
    (hasNum || hasSymbol)
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

let copybtn = document.querySelector("[data-copy]");
let copymsg = document.querySelector("[data-copymsg]");
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passworddisplay.value);
    copymsg.innerText = "copied";
  } catch (e) {
    copymsg.innerText = "Failed";
  }
  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handlePassword();
});

copybtn.addEventListener("click", () => {
  if (passworddisplay.value) {
    copyContent();
  }
});

function shufflePassword(arr) {
  //Fisher yeates method
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  let ans = "";
  arr.forEach((ch) => (ans += ch));
  return ans;
}

let password = "";
let generatebtn = document.querySelector("#generatepassword");
generatebtn.addEventListener("click", () => {
  if (checkcount == 0) return;

  //special case
  if (passwordlength < checkcount) {
    passwordlength = checkcount;
    handlePassword();
  }

  //this is important
  // first clear your old password
  password = "";
  let arrFun = [];
  if (uppercase.checked) {
    arrFun.push(getUppercase);
  }
  if (lowercase.checked) {
    arrFun.push(getLowercase);
  }
  if (number.checked) {
    arrFun.push(getRandomNumber);
  }
  if (symbol.checked) {
    arrFun.push(getSymbols);
  }

  for (let i = 0; i < arrFun.length; i++) {
    password += arrFun[i]();
  }
  for (let i = 0; i < passwordlength - arrFun.length; i++) {
    let ind = getInteger(0, arrFun.length);
    password += arrFun[ind]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  passworddisplay.value = password;
  calcStrength();
});
