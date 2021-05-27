/*
// snadné načtení souboru pro každého!
fetch("https://blabla.cz/blabla.json")
  .then(response => response.json()) // nebo .text(), když to není json
  .then(data => {
    // tady jde provést s daty cokoliv
  });
*/

function foo(msg) {
  let fn = function inner() {
    return msg.toUpperCase();
  };
  return fn;
}

let helloFn = foo("jjj");

console.log(helloFn());
