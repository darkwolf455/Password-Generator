const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*()_+{}|:">?</.,;/';
let password="";
let passwordLength=10;
let checkCount=0;
setIndicator("#ccc")

handleSlider();
//set password lenhgth
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min= inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color; 
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
   return Math.floor(Math.random() * (max-min)) + min;
}

function getRndNumber(){
    return getRndInteger(0,9);
}

function getRndLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function getRndUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasSymbols=false;
    let hasNum=false;
    if(uppercaseCheck.checked)hasUpper=true;
    if(lowercaseCheck.checked)hasLower=true;
    if(numbersCheck.checked)hasNum=true;
    if(symbolsCheck.checked)hasSymbols=true;
    if(hasUpper && hasLower &&(hasNum || hasSymbols) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasNum || hasSymbols) && (hasUpper || hasLower) &&passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
 
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    // 1. Show the message
    copyMsg.classList.add("active");

    // 2. Start the timer
    setTimeout(() => {
        // 3. This runs after 2 seconds:
        copyMsg.classList.remove("active"); // Removes the visual bubble
        
        // Optional: Clear the text so it's fresh for next time
        setTimeout(() => { copyMsg.innerText = ""; }, 500); 
    }, 2000);
}
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)checkCount++;
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});
function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}
generateBtn.addEventListener('click', () => {
    if(checkCount<=0)return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    // if(uppercaseCheck.checked){
    //     password+=getRndUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=getRndLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=getRndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    let funcarr=[];
    if(uppercaseCheck.checked){
        funcarr.push(getRndUpperCase);
    }
    if(lowercaseCheck.checked){
        funcarr.push(getRndLowerCase);
    }
    if(numbersCheck.checked){
        funcarr.push(getRndNumber);
    }
    if(symbolsCheck.checked){
        funcarr.push(generateSymbol);
    }

    for(let i=0;i<funcarr.length;i++){
        password+=funcarr[i]();
    }

    for(let i=0;i<passwordLength-funcarr.length;i++){
        let randIndex=getRndInteger(0,funcarr.length);
        password+=funcarr[randIndex]();
    }

    // shuffle password

    password=shufflePassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength();


})