const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

function docxGenerator (fields) {
  console.log('Fields', fields)
  const date = moment().format('MMMM D, YYYY')

  const OUTPUT_FILE_NAME = `${fields.name} - ${fields.companyName.replace(/[^\w\s]/gi, '')}`
  const DOCX_TEMPLATE_FILE = fields.settings.inputFile
  const DOCX_OUTPUT_FILE = `${fields.settings.exportFolder}/${OUTPUT_FILE_NAME}.docx`

  //Load the docx file as a binary
  let content = fs
    .readFileSync(path.resolve(__static, DOCX_TEMPLATE_FILE), 'binary') //eslint-disable-line no-undef

  let zip = new PizZip(content)
  let doc

  try {
    doc = new Docxtemplater(zip)
  } catch(error) {
    // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
    errorHandler(error)
  }

  //set the templateVariables
  doc.setData(fields)

  try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render()
  }
  catch (error) {
    // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
    errorHandler(error)
  }

  var buf = doc.getZip()
    .generate({type: 'nodebuffer'})

  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync(path.resolve(__static, DOCX_OUTPUT_FILE), buf) //eslint-disable-line no-undef

  console.log('value:', fields, date)
}

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors (key, value) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function(error, key) {
      error[key] = value[key]
      return error
    }, {})
  }
  return value
}

function errorHandler (error) {
  console.log(JSON.stringify({error: error}, replaceErrors))

  if (error.properties && error.properties.errors instanceof Array) {
    const errorMessages = error.properties.errors.map(function (error) {
      return error.properties.explanation
    }).join("\n")
    console.log('errorMessages', errorMessages)
    // errorMessages is a humanly readable message looking like this :
    // 'The tag beginning with "foobar" is unopened'
  }
  throw error
}

export { docxGenerator }
