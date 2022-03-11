// TO RUN THIS REPL, YOU NEED TO USE THE COMMAND PROMPT, AND TYPE :
// deno run index.ts [your phrase]
interface String {
    isPalindrome(): boolean;
}

interface dict {
  [k: string]: number
}

String.prototype.isPalindrome = function () {
  if (this == this.split("").reverse().join("")) return true;
  return false
};

function jumbleIntoPalindrome(phrase : string, chars : dict) {
  let nbOfSteps : number = 0;
  if (phrase.length % 2 != 0) {
    for (let key in chars) {
      if (chars[key] % 2 == 0) continue;
      if (phrase.indexOf(key) + 1 != (phrase.length + 1) / 2) {
      nbOfSteps ++;
      }
      let found : boolean = false
      let index : number = -1
      phrase.split("").forEach((c : string, i : number) => {
        if (c != key || found) return;
        if (phrase.charAt(phrase.length - i) == c) return;
        found = true;
        index = i;
      })
      let phraseArr : Array<string> = phrase.split("");
      phraseArr.splice(index, 1);
      phrase = phraseArr.join("");
      if (chars[key] == 1) delete chars[key]
      else chars[key] --;
    };
  }
  let firstHalf : string = phrase.substr(0, phrase.length / 2);
  let lastHalf : string = phrase.substr(phrase.length / 2);
  for (let key in chars) {
    let charRegex : RegExp = new RegExp(key,"g");
    let firstMatch : Array<string> | null = firstHalf.match(charRegex);
    let lastMatch : Array<string> | null = lastHalf.match(charRegex);
    if (firstMatch == null) firstMatch = [];    
    if (lastMatch == null) lastMatch = [];
    let diff : number = firstMatch.length - lastMatch.length;
    if (diff < 0) {
      firstHalf.split("").forEach((c, i) => {
        if (c != key) return;
        if (phrase.charAt(phrase.length - 1 - i) != key) nbOfSteps ++
      })
    } else {
      lastHalf.split("").forEach((c, i) => {
        if (c != key) return;
        if (phrase.charAt(lastHalf.length - 1 - i) != key) nbOfSteps ++
      })
    }
    nbOfSteps += Math.abs(diff) / 2
    delete chars[key];
    firstHalf = firstHalf.split(key).join("");
    lastHalf = lastHalf.split(key).join("");
    phrase = phrase.split(key).join("");
  }
  console.log(`Your input isn't a palindrome. However, I can jumble it into one with at least ${nbOfSteps} steps`)
}

function createPalindrome(phrase : string) {
  let isPalindrome : boolean = false;
  let nonPalindromedChar : number = 0;
  while (!isPalindrome) {
    phrase = phrase.substr(1);
    nonPalindromedChar ++;
    if (phrase.isPalindrome()) isPalindrome = true;
  }
  console.log(`Your input isn't a palindrome and can't be jumbled into a palindrome. In order to make it a palindrome, you would need to add ${nonPalindromedChar} characters to the end of your input`)
}

function main () : void {
  let phrase = Deno.args.join(" ").toLowerCase();
  if (phrase.isPalindrome()) return console.log("You entered a palindrome");
  let chars : dict = {};
  phrase.split("").forEach((char : string) => {if (chars[char]) chars[char] ++; else chars[char] = 1});
  let numberOfOddLetters = 0;
  for (let key in chars) {if (chars[key] % 2 != 0) numberOfOddLetters ++};
  if (numberOfOddLetters > 1) return createPalindrome(phrase)
  else return jumbleIntoPalindrome(phrase, chars)
}

main()