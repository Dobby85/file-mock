const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const fileMock = {
  _createdFiles: [],

  mock: function (filesObject) {
    this.fillCreatedFiles(filesObject)

    for (let i = 0; i < this._createdFiles.length; i++) {
      this._createdFiles[i] = this.createPathAndFile(this._createdFiles[i])
    }
  },

  createPathAndFile: function (fileToCreate) {
    let splittedPath = fileToCreate.path.split('/')
    let firstCreated = null

    let tmpPath = '/'
    for (let i = 0; i < splittedPath.length; i++) {
      tmpPath = path.join(tmpPath, splittedPath[i])

      if (i + 1 >= splittedPath.length) {
        firstCreated = (firstCreated === null) ? tmpPath : firstCreated
        fs.writeFileSync(tmpPath, fileToCreate.content)
      } else if (!fs.existsSync(tmpPath)) {
        firstCreated = (firstCreated === null) ? tmpPath : firstCreated
        fs.mkdirSync(tmpPath)
      }
    }

    fileToCreate.toDelete = firstCreated
    return fileToCreate
  },

  fillCreatedFiles: function (filesObject, _currentPath = '') {
    for (let i = 0; i < Object.keys(filesObject).length; i++) {
      let objectPath = Object.keys(filesObject)[i]
      let value = filesObject[objectPath]

      let pathStart = _currentPath

      if (pathStart === '') {
        pathStart = (objectPath.startsWith('/')) ? objectPath : path.join(process.cwd(), objectPath)
      } else {
        pathStart = path.join(pathStart, objectPath)
      }

      if (typeof value === 'object') {
        this.fillCreatedFiles(value, pathStart)
      } else {
        this._createdFiles.push({
          path: pathStart,
          content: value
        })
      }
    }
  },

  restore: function () {
    for (let i = 0; i < this._createdFiles.length; i++) {
      if (this._createdFiles[i].toDelete != undefined) {
        rimraf.sync(this._createdFiles[i].toDelete)
      }
    }
    this._createdFiles = []
  }
}

module.exports = fileMock
