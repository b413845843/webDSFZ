const Printer = require('../index').Printer

let service = {
  getAll(success, fail) {
    Printer.findAll()
      .then(printers => {
        success(printers)
      })
      .catch(err => {
        fail(err)
      })
  },
  addPrinter(success, fail) {

  }
}

module.exports = service