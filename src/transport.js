const nodemailer = require('nodemailer')
const ses = require('nodemailer-ses-transport')
const sendgrid = require('nodemailer-sendgrid-transport')
const postmark = require('nodemailer-postmark-transport')
const mandrill = require('nodemailer-mandrill-transport')
const mailgun = require('nodemailer-mailgunapi-transport')
const stub = require('nodemailer-stub-transport')
const winston = require('winston')

module.exports = env => {
  switch(env('TRANSPORT')) {
    case 'ses':
      AWS.config.update({
        accessKeyId: env('AWS_KEY'),
        secretAccessKey: env('AWS_SECRET'),
        region: env('AWS_REGION')
      })
      return nodemailer.createTransport(ses({ ses: new AWS.SES() }))
    case 'sendgrid':
      return nodemailer.createTransport(sendgrid({
        auth: {
          api_user: env('SENDGRID_USERNAME'),
          api_key: env('SENDGRID_PASSWORD') || env('SENDGRID_API_KEY')
        }
      }))
    case 'postmark':
      return nodemailer.createTransport(postmark({
        auth: {
          apiKey: env('POSTMARK_API_KEY')
        }
      }))
    case 'mandrill':

    case 'mailgun':

    case 'stub':
      return nodemailer.createTransport(stub())
  }
  winston.error('No valid TRANSPORT set')
  return nodemailer.createTransport() // direct transport
}