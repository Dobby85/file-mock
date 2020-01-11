const assert = require('assert')
const fileMock = require('../index')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

describe('File mock', () => {
  afterEach(() => {
    fileMock.restore()
  })

  describe('Fill created files', () => {
    it('should fill created files with multilple files and content', () => {
      let obj = {
        'server/uploads/name1.jpg': 'File content',
        '/path/to/file': {
          'file1.jpg': 'Content',
          'file2.jpg': 'new content'
        },
        '/path': {
          'to': {
            'my': {
              'file': 'olala'
            }
          }
        }
      }
      fileMock.fillCreatedFiles(obj)
      assert.strictEqual(fileMock._createdFiles.length, 4)

      let key = path.join(process.cwd(), 'server', 'uploads', 'name1.jpg')
      assert.deepStrictEqual(fileMock._createdFiles[0], { path: key, content: 'File content' })
      assert.deepStrictEqual(fileMock._createdFiles[1], { path: '/path/to/file/file1.jpg', content: 'Content' })
      assert.deepStrictEqual(fileMock._createdFiles[2], { path: '/path/to/file/file2.jpg', content: 'new content' })
      assert.deepStrictEqual(fileMock._createdFiles[3], { path: '/path/to/my/file', content: 'olala' })
    })

    it('should not crash with an empty object', () => {
      let obj = {}
      fileMock.fillCreatedFiles(obj)
      assert.strictEqual(fileMock._createdFiles.length, 0)
    })
  })

  describe('Create path and file', () => {
    let pathToDelete = null

    afterEach(() => {
      if (pathToDelete !== null && fs.existsSync(pathToDelete)) {
        rimraf.sync(pathToDelete)
      }
    })

    it('should create a file', () => {
      pathToDelete = path.join(process.cwd(), 'file.png')
      let obj = {
        path: pathToDelete,
        content: 'My content'
      }

      obj = fileMock.createPathAndFile(obj)
      assert.strictEqual(obj.toDelete, pathToDelete)
      assert.strictEqual(fs.existsSync(pathToDelete), true)
      let content = fs.readFileSync(pathToDelete, 'utf8')
      assert.strictEqual(content, 'My content')
    })

    it('should create path and file', () => {
      let p = path.join(process.cwd(), 'new', 'dir', 'file.png')
      pathToDelete = path.join(process.cwd(), 'new')
      let obj = {
        path: p,
        content: 'New content'
      }

      obj = fileMock.createPathAndFile(obj)
      assert.strictEqual(obj.toDelete, pathToDelete)
      assert.strictEqual(fs.existsSync(p), true)
      let content = fs.readFileSync(p, 'utf8')
      assert.strictEqual(content, 'New content')
    })

    it('should not delete a directory which already exists', () => {
      let p = path.join(process.cwd(), 'test', 'new', 'file.png')
      pathToDelete = path.join(process.cwd(), 'test', 'new')
      let obj = {
        path: p,
        content: 'New content olala'
      }

      obj = fileMock.createPathAndFile(obj)
      assert.strictEqual(obj.toDelete, pathToDelete)
      assert.strictEqual(fs.existsSync(p), true)
      let content = fs.readFileSync(p, 'utf8')
      assert.strictEqual(content, 'New content olala')

    })
  })

  describe('Mock', () => {
    it('should mock multiple files and restore everything', () => {
      let obj = {
        'server/uploads/name1.jpg': 'File content',
        '/var/tmp': {
          'file1.jpg': 'Content',
          'file2.jpg': 'new content'
        },
        '/var': {
          'tmp': {
            'test': {
              'file': 'olala'
            }
          }
        }
      }

      fileMock.mock(obj)
      assert.strictEqual(fs.existsSync(path.join(process.cwd(), 'server', 'uploads', 'name1.jpg')), true)
      assert.strictEqual(fs.existsSync(path.join('/var', 'tmp', 'file1.jpg')), true)
      assert.strictEqual(fs.existsSync(path.join('/var', 'tmp', 'file2.jpg')), true)
      assert.strictEqual(fs.existsSync(path.join('/var', 'tmp', 'test', 'file')), true)

      let content = fs.readFileSync(path.join(process.cwd(), 'server', 'uploads', 'name1.jpg'), 'utf8')
      assert.strictEqual(content, 'File content')
      content = fs.readFileSync(path.join('/var', 'tmp', 'file1.jpg'), 'utf8')
      assert.strictEqual(content, 'Content')
      content = fs.readFileSync(path.join('/var', 'tmp', 'file2.jpg'), 'utf8')
      assert.strictEqual(content, 'new content')
      content = fs.readFileSync(path.join('/var', 'tmp', 'test', 'file'), 'utf8')
      assert.strictEqual(content, 'olala')

      fileMock.restore()
      assert.strictEqual(fs.existsSync(path.join(process.cwd(), 'server', 'uploads', 'name1.jpg')), true)
      assert.strictEqual(fs.existsSync(path.join('/var', 'tmp', 'file1.jpg')), true)
      assert.strictEqual(fs.existsSync(path.join('/var', 'tmp', 'file2.jpg')), true)
      assert.strictEqual(fs.existsSync(path.join('/var', 'tmp', 'test', 'file')), true)
    })
  })
})
