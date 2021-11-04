import { readFile, writeFile } from 'fs';

function write(filename, jsonContentObj, funcInWrite) {
  // eslint-disable-next-line max-len
  /* callPrintFunc is the function passed as an argument to the parameter funcInWrite. callPrintFunc was passed from add() to edit() to write() here */
  const jsonContentStr = JSON.stringify(jsonContentObj);

  // Write content to DB
  writeFile(filename, jsonContentStr, (writeErr) => {
    if (writeErr) {
      console.error('Write error', jsonContentStr, writeErr);
      // Allow each client app to handle errors in their own way
      funcInWrite(writeErr, null);
      return;
    }
    console.log('Write success!');
    // Call client-provided callback on successful write
    funcInWrite(null, jsonContentObj);
  });
}

function read(filename, funcInRead) {
  readFile(filename, 'utf-8', (readErr, jsonContentStr) => {
    if (readErr) {
      console.error('Read error', readErr);
      // Allow client to handle error in their own way
      return funcInRead(readErr, null);
    }
    // Convert file content to JS Object
    const jsonContentObj = JSON.parse(jsonContentStr);
    return funcInRead(null, jsonContentObj);
  });
}

function edit(filename, func1InEdit, func2InEdit) {
  // Read contents of target file and perform callback on JSON contents

  read(filename, (readErr, jsonContentObj) => {
    // Exit if there was a read error
    if (readErr) {
      console.error('Read error', readErr);
      func1InEdit(readErr, null);
      return;
    }

    // Perform custom edit operations here.
    // jsonContentObj mutated in-place because object is mutable data type.
    func1InEdit(null, jsonContentObj);

    // Write updated content to target file.
    write(filename, jsonContentObj, func2InEdit);
  });
}

// 'data.json', 'sightings', request.body, (err)

function add(filename, key, input, callPrintFunc) {
  edit(
    filename,
    // this entire function (line 58 to 76) is func1InEdit
    (err, jsonContentObj) => {
      // Exit if there was an error
      if (err) {
        console.error('Edit error', err);
        callPrintFunc(err);
        return;
      }

      // Exit if key does not exist in DB
      if (!(key in jsonContentObj)) {
        console.error('Key does not exist');
        // Call callback with relevant error message to let client handle
        callPrintFunc('Key does not exist');
        return;
      }
      // Add input element to target array
      jsonContentObj[key].push(input);
    },
    // this is passed back to edit() as argument for func2InEdit parameter
    callPrintFunc,
  );
}

function remove(filename, key, index, callPrintFunc) {
  if (process.argv.length < 5) {
    console.log(
      'Please input command as: "node index.js remove <list: either items or done, to remove from> <number of the item to remove>"',
    );
  } else {
    edit(
      filename,
      (err, jsonContentObj) => {
        if (err) {
          console.error('Edit error', err);
          callPrintFunc(err);
          return;
        }
        if (!(key in jsonContentObj)) {
          console.error('Key does not exist');
          callPrintFunc('Key does not exist');
          return;
        }
        jsonContentObj[key].splice(index, 1);
      },
      callPrintFunc,
    );
  }
}

function editOneElement(filename, key, index, payload, callPrintFunc) {
  if (process.argv.length < 6) {
    console.log(
      'Please input command as: "node index.js editOne <list: either items or done> <number of the item to edit> <contents to change item to>"',
    );
  } else {
    edit(
      filename,
      (err, jsonContentObj) => {
        if (err) {
          console.error('Edit error', err);
          callPrintFunc(err);
          return;
        }
        if (!(key in jsonContentObj)) {
          console.error('Key does not exist');
          callPrintFunc('Key does not exist');
          return;
        }
        jsonContentObj[key][index] = payload;
      },
      callPrintFunc,
    );
  }
}

export {
  write, read, add, edit, remove, editOneElement,
};
