// function foo() {
//   return { a: 1 }
// }
//
// foo().a
//
// const thing = foo()
// thing.a

// const p = tickingPromise(5, "asdfasdf")
//
// p.then(val => console.log("Then got value", val))
// p.then(function(val) {
//   console.log("No really, got value", val)
// })
// p.then(val => console.log("Yep, still done"))


// const p = tickingPromise(3, 5)
// p.then(x => x + 1)
//  .then(x => x / 2)
//  // .then(x => console.log("x is", x))
//  .then(m => tickingPromise(m, m * 2))
//  .then(x => console.log("Final result:", x))


// const p = impatientWaiter(11, "Okay!")
// p.then(str => console.log(str.length))
//  .catch(e => console.log("Something went wrong, namely:", e))


// const p = tickingPromise(3, 6)
// p.then(x => x * 2)
//  // .then(x => console.log("x is", x))
//  .then(m => impatientWaiter(m, m * 2))
//  .then(() => console.log("Does this happen?"))
//  .then(x => console.log("Final result:", x))
//  .catch(e => console.log("Errored:", e))


// const p = probably("heads", 2)
// p.then(res => console.log(res))
//  .catch(e => console.log("tails"))


// const p = getKeyPress()
// const q = getKeyPress()

// p.then(key => console.log("p got key", key))
// q.then(key => console.log("q got key", key))
// p.then(key => console.log("Second time - p got key", key))

// Promise.all([
//   p,
//   q
// ]).then(vals => console.log("done, with vals", vals))

// const everything = Promise.all([
//   impatientWaiter(9, "first"),
//   impatientWaiter(15, "third"),
//   impatientWaiter(2, "second")
// ])
//
// everything.then(res => console.log(res))
//           .catch(e => console.log("error", e))


// const coin = () => probably("heads", 2).catch(e => "tails")
// const fiveCoins = Promise.all([
//   coin(),
//   coin(),
//   coin(),
//   coin(),
//   coin()
// ])
// fiveCoins.then(val => console.log(val))

// const password = Promise.all([
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress()
// ])

// password.then(keys => {
//   const entered = String.fromCharCode(...keys)
//   if (entered === "hunter2") {
//     console.log("Welcome back")
//   } else {
//     alert("Bad password! " + entered)
//   }
// })

const token = "[REDACTED]"

function findIdForChannel(channelName) {
  console.log("looking for", channelName)

  const url = `
    https://slack.com/api/channels.list?
    token=${token}`

  return fetch(url, {method: "POST"})
    .then(res => res.json())
    .then(json => {
      let match

      json.channels.forEach(chan => {
        if (chan.name == channelName) {
          match = chan
        }
      })

      return match.id
    })
}

function sendMessageWithId(roomId, message) {
  console.log("Now sending", roomId, message)
  const url = `
    https://slack.com/api/chat.postMessage?
    token=${token}&
    channel=${roomId}&
    text=${message}`
  fetch(url, {method: "POST"})
}

function sendMessageToRoom(roomName, message) {
  const idPromise = findIdForChannel(roomName)

  idPromise.then(id => sendMessageWithId(id, message))
}
