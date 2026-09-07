module.exports = {
  default: {
    require: [
      'features/stepDefinitions/*.ts',
      'hooks/*.ts'
    ],
    requireModule: [
      'ts-node/register'
    ],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ]
    // parallel: 3
  }
};