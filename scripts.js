//// 0) Two different ways of doing the same thing
// function foo() {
//   return { a: 1 }
// }
//
// foo().a
//
// const thing = foo()
// thing.a


//// 1) _All_ `then` callbacks fire as soon as the promised value is ready
// const p = tickingPromise(5, "asdfasdf")
//
// p.then(val => console.log("Then got value", val))
// p.then(function(val) {
//   console.log("No really, got value", val)
// })
// p.then(val => console.log("Yep, still done"))


//// 2) You can chain `then`s together to "pipeline" an operation
////    Note that if there's a promise somewhere in the pipeline, we'll wait
////      for it to resolve before moving on to the next `then` step
// const p = tickingPromise(3, 5)
// p.then(x => x + 1)
//  .then(x => x / 2)
//  // .then(x => console.log("x is", x))
//  .then(m => tickingPromise(m, m * 2))
//  .then(x => console.log("Final result:", x))


//// 3) Sometimes promises fail to resolve; we can `catch` and handle those errors
// const p = impatientWaiter(11, "Okay!")
// p.then(str => console.log(str.length))
//  .catch(e => console.log("Something went wrong, namely:", e))


//// 4) We don't have to care where in the pipeline an error occurred
// const p = tickingPromise(3, 6)
// p.then(x => x * 2)
//  // .then(x => console.log("x is", x))
//  .then(m => impatientWaiter(m, m * 2))
//  .then(() => console.log("Does this happen?"))
//  .then(x => console.log("Final result:", x))
//  .catch(e => console.log("Errored:", e))


//// 5) A weird way of simulating a coin - this has a 50/50 chance of
////      resolving to `heads` or erroring; if it errors, we log `tails`
// const p = probably("heads", 2)
// p.then(res => console.log(res))
//  .catch(e => console.log("tails"))


//// 6) Promises that resolve the next time we press a key
////    Note that _both_ `p` promises resolve on the first keypress
////       and then the `q` promise resolves on the next one
// const p = getKeyPress()
// const q = getKeyPress()
//
// p.then(key => console.log("p got key", key))
// q.then(key => console.log("q got key", key))
// p.then(key => console.log("Second time - p got key", key))


//// 7) Wait for multiple promises to finish and grab the result of all of them
// Promise.all([
//   p,
//   q
// ]).then(vals => console.log("done, with vals", vals))

//// 8) If any of them error, then the composite errors
// const everything = Promise.all([
//   impatientWaiter(9, "first"),
//   impatientWaiter(15, "third"),
//   impatientWaiter(2, "second")
// ])
//
// everything.then(res => console.log(res))
//           .catch(e => console.log("error", e))


//// 9) Using all to simulate waiting for 5 coin flips
// const coin = () => probably("heads", 2).catch(e => "tails")
// const fiveCoins = Promise.all([
//   coin(),
//   coin(),
//   coin(),
//   coin(),
//   coin()
// ])
// fiveCoins.then(val => console.log(val))

//// 10) Waiting for 7 keypresses to get a password
// const password = Promise.all([
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress(),
//   getKeyPress()
// ])
//
// password.then(keys => {
//   const entered = String.fromCharCode(...keys)
//   if (entered === "hunter2") {
//     console.log("Welcome back")
//   } else {
//     alert("Bad password! " + entered)
//   }
// })

const token = "[REDACTED]"

// This function takes the name of a Slack channel
// and returns a promise that will resolve to the
// id of that channel (or will error, if the channel
// isn't found)
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

// This function takes a known Slack room id
// and returns a promise to send the message
function sendMessageWithId(roomId, message) {
  console.log("Now sending", roomId, message)
  const url = `
    https://slack.com/api/chat.postMessage?
    token=${token}&
    channel=${roomId}&
    text=${message}`
  fetch(url, {method: "POST"})
}

// This combines the two functions above by fetching
//   the room id, waiting for _that_ response, and
//   and only then sending the message using the
//   found room id
function sendMessageToRoom(roomName, message) {
  const idPromise = findIdForChannel(roomName)

  idPromise.then(id => sendMessageWithId(id, message))
}
