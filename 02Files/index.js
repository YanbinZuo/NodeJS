// const fs = require('fs')
const fsPromises = require("fs").promises;
const path = require("path");

// fs.readFile('./files/starter.txt', 'utf8', (err, data) => {
//   if(err) throw err;
//   // console.log(data.toString())
//   console.log(data)
// })

/*
fs.readFile(path.join(__dirname,'files', 'starter.txt'), 'utf8', (err, data) => {
  if(err) throw err;
  console.log(data)
})

fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you!', (err) => {
  if(err) throw err;
  console.log("Write success!")

  fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), "\n\nAppend test.", (err) => {
    if(err) throw err;
    console.log("Inside append success!")

    fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'), (err) => {
      if(err) throw err;
      console.log('Rename success!')
    })
  })
})

fs.appendFile(path.join(__dirname, 'files', 'test.txt'), "Test.", (err) => {
  if(err) throw err;
  console.log("Append success!") 
})


console.log("hello...")
*/

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8')
    console.log(data)
    // unlink: delete
    await fsPromises.unlink(path.join(__dirname, 'files', 'starter.txt'))
    await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data)
    await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nHi there')
    await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'newPromiseWrite.txt'))
    
    const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'newPromiseWrite.txt'), 'utf8')
    console.log('------------------------')
    console.log(newData)
  } catch (err) {
    console.log(err);
  }
};

fileOps();

process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
});
