/* 
Due: TBD (expect about a week)
Project 1: Slot Machine
- Rules can be whatever you want
- Symbols can be whatever you want (&, *, (, #, etc..)
- Must include some promise object
- Must include an async function that awaits a promise
- Starting balance, betting system, continue playing by choice, scoring system
- IDEA: Animate the console when you "pull the lever"
  - HINT: combination of console.log and console.clear()

  * & &
[ $ $ $ ] <-
  * ( *

HAVE FUN
*/

const symbolArrayLeft = ["!", "@", "#", "$", "%", "&", "!", "@"];
const symbolArrayMid = ["#", "!", "@", "#", "&", "$", "#", "!"];
const symbolArrayRight = ["%", "#", "!", "$", "&", "@", "%", "#"];

const sleep = () => new Promise((resolve) => setTimeout(resolve, 200));

class Frame {
  constructor(left = 0, mid = 0, right = 0) {
    this.left = left;
    this.mid = mid;
    this.right = right;

    if (this.left !== 0) {
      this.leftWheel = this.left;
    } else {
      this.leftWheelSliceIndices = Frame.randomSlice();
      this.leftWheel = symbolArrayLeft.slice(
        this.leftWheelSliceIndices[0],
        this.leftWheelSliceIndices[1]
      );
    }

    if (this.mid !== 0) {
      this.middleWheel = this.mid;
    } else {
      this.middleWheelSliceIndices = Frame.randomSlice();
      this.middleWheel = symbolArrayMid.slice(
        this.middleWheelSliceIndices[0],
        this.middleWheelSliceIndices[1]
      );
    }

    if (this.right !== 0) {
      this.rightWheel = this.right;
    } else {
      this.rightWheelSliceIndices = Frame.randomSlice();
      this.rightWheel = symbolArrayRight.slice(
        this.rightWheelSliceIndices[0],
        this.rightWheelSliceIndices[1]
      );
    }

    this.frameArray = [
      this.leftWheel[0],
      this.middleWheel[0],
      this.rightWheel[0],
      this.leftWheel[1],
      this.middleWheel[1],
      this.rightWheel[1],
      // "@",
      // "@",
      // "@",
      this.leftWheel[2],
      this.middleWheel[2],
      this.rightWheel[2],
    ];
  }

  static randomSlice() {
    const start = Math.floor(Math.random() * 6);
    const end = start + 3;
    return [start, end];
  }

  static checkLastFrame(frame) {
    frame = frame.frameArray;
    if (frame[3] === frame[4] && frame[3] === frame[5]) {
      console.log("    YOU WIN!  ");
      return true;
    } else {
      console.log("    TOO BAD!  ");
      return false;
    }
  }
}

class Ledger {
  constructor() {
    this.balance = 500;
  }

  addBalance(funds) {
    this.balance = this.balance + funds;
  }

  winBet() {
    this.balance = this.balance * 2;
  }

  loseBet(betAmount) {
    this.balance = this.balance - betAmount;
  }

  printBalance() {
    console.log(`Your Balance: $${this.balance}`);
  }
}

function generateFrame(betAmount, left = 0, mid = 0, right = 0) {
  let frame;
  if (left !== 0 && mid === 0 && right === 0) {
    frame = new Frame(left);
  } else if (left !== 0 && mid !== 0 && right === 0) {
    frame = new Frame(left, mid);
  } else if (left !== 0 && mid !== 0 && right !== 0) {
    frame = new Frame(left, mid, right);
  } else {
    frame = new Frame(); // <--- WHAT?????????
  }
  console.log(`Your bet: $${betAmount}`);
  console.log(`   _________ `);
  console.log(
    `   |${frame.frameArray[0]}||${frame.frameArray[1]}||${frame.frameArray[2]}|   `
  );
  console.log(
    `  {|${frame.frameArray[3]}||${frame.frameArray[4]}||${frame.frameArray[5]}|} <-  `
  );
  console.log(
    `   |${frame.frameArray[6]}||${frame.frameArray[7]}||${frame.frameArray[8]}|   `
  );
  console.log(`   """""""""   `);
  return frame;
}

async function startSlots() {
  const newLedger = new Ledger();
  let leftWheelStorage;
  let midWheelStorage;
  let counter = 1;
  let frame;
  let inputContinue = "placeholder";
  while (inputContinue.toLowerCase() !== "no") {
    input = prompt("How much would you like to bet?");
    while (counter < 37) {
      await sleep();
      console.clear();
      if (counter !== 36) {
        newLedger.printBalance();
      }
      if (counter < 24) {
        frame = generateFrame(input);
      }
      if (counter === 24) {
        frame = generateFrame(input);
        leftWheelStorage = [
          frame.frameArray[0],
          frame.frameArray[3],
          frame.frameArray[6],
        ];
        console.log("    ^");
      }
      if (counter > 24 && counter < 30) {
        frame = generateFrame(input, leftWheelStorage);
        console.log("    ^");
      }
      if (counter === 30) {
        frame = generateFrame(input, leftWheelStorage);
        midWheelStorage = [
          frame.frameArray[1],
          frame.frameArray[4],
          frame.frameArray[7],
        ];
        console.log("    ^  ^");
      }
      if (counter > 30 && counter < 36) {
        frame = generateFrame(input, leftWheelStorage, midWheelStorage);
        console.log("    ^  ^");
      }
      if (counter === 36) {
        frame = generateFrame(input, leftWheelStorage, midWheelStorage);
        console.log("    ^  ^  ^");
        if (Frame.checkLastFrame(frame)) {
          newLedger.winBet();
          newLedger.printBalance();
        } else {
          newLedger.loseBet(input);
          newLedger.printBalance();
        }
      }
      counter++;
    }
    counter = 0;
    inputContinue = prompt("Would you like to play again? ");
  }
}

startSlots();
