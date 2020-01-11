# File mock

file-mock is a tool that will handle file's creation and deletion automatically for your tests.

You have to specify, which file in which location you want and file mock will create all directories and files.

## Mock

```js
const fmock = require('file-mock')

fmock.mock({
  'server/uploads/test.png': 'File content',
  '/path/to/file.jpg': 'File content',
  '/path': {
    'to': {
      'myfile.png': 'File content'
    },
    'to1': {
      'myfile.png': 'File content'
    }
  }
})
```

**Warning**  
If your path starts with a `/`, it will let it like this. In this example we have
- `/path/to/file.jpg`
- `/path/to/myfile.jpg`
- `/path/to1/myfile.jpg`
If it does not start with a `/`, the first part of the path will be the result of the `process.cwd()` function (usually the root of your repository).

## Restore

To restore as before, you can use the restore function.

```js
fmock.restore()
```

This function will delete all files and directories that have been created by the mock function. 

**This will never remove a directory that already exists**
