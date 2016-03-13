// For storing config exclusive to this spreadsheet
var documentProperties = PropertiesService.getDocumentProperties();

// Register datahub menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Datahub')
      .addItem('Export sheet as json', 'exportJson')
      .addSubMenu(ui.createMenu('Configuration')
          .addItem('Set Configuration', 'setConfig')
          .addItem('View Configuration', 'viewConfig'))
      .addToUi();
}

// Walk user through the process of setting config
function setConfig() {
  var ui = SpreadsheetApp.getUi();
  var result1 = ui.prompt(
      'Step 1 of 4',
      'AWS Access Key:',
      ui.ButtonSet.OK_CANCEL);

  var button1 = result1.getSelectedButton();
  var text1 = result1.getResponseText();

  if (button1 == ui.Button.OK && text1 !== "") {
    documentProperties.setProperty('AWS_ACCESS_KEY', text1);
  } else {
    incompleteSetup();
  }

  var result2 = ui.prompt(
      'Step 2 of 4',
      'AWS Secret Key:',
      ui.ButtonSet.OK_CANCEL);

  var button2 = result2.getSelectedButton();
  var text2 = result2.getResponseText();

  if (button2 == ui.Button.OK && text2 !== "") {
    documentProperties.setProperty('AWS_SECRET_KEY', text2);
  } else {
    incompleteSetup();
  }

  var result3 = ui.prompt(
      'Step 3 of 4',
      'AWS Bucket:',
      ui.ButtonSet.OK_CANCEL);

  var button3 = result3.getSelectedButton();
  var text3 = result3.getResponseText();

  if (button3 == ui.Button.OK && text3 !== "") {
    documentProperties.setProperty('AWS_BUCKET', text3);
  } else {
    incompleteSetup();
  }

  var result4 = ui.prompt(
      'Step 4 of 4',
      'Project path:',
      ui.ButtonSet.OK_CANCEL);

  var button4 = result4.getSelectedButton();
  var text4 = result4.getResponseText();

  if (button4 == ui.Button.OK && text4 !== "") {
    documentProperties.setProperty('PROJECT_PATH', text4);
  } else {
    incompleteSetup();
  }

}

// view configutation
function viewConfig() {
  var ui = SpreadsheetApp.getUi();
  ui.alert("AWS Access Key: " + documentProperties.getProperty('AWS_ACCESS_KEY') + "\n"
      + "AWS Secret Key: " + documentProperties.getProperty('AWS_SECRET_KEY') + "\n"
      + "AWS Bucket: " + documentProperties.getProperty('AWS_BUCKET') + "\n"
      + "Project Path: " + documentProperties.getProperty('PROJECT_PATH')
  );
}

// debug configuration fields
function incompleteSetup() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Configuration is incomplete, please restart the process. \n'
      + "AWS Access Key: " + documentProperties.getProperty('AWS_ACCESS_KEY') + "\n"
      + "AWS Secret Key: " + documentProperties.getProperty('AWS_SECRET_KEY') + "\n"
      + "AWS Bucket: " + documentProperties.getProperty('AWS_BUCKET') + "\n"
      + "Project Path: " + documentProperties.getProperty('PROJECT_PATH')
  );
}


function exportJson() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var numCols = rows.getNumColumns();
  var values = rows.getValues();

  var output = '';
  output += '{"data" : [';
  var header = values[0];
  for (var i = 1; i < numRows; i++) {
    if (i > 1) output += ', ';
    var row = values[i];
    output += '{';
    for (var j = 1;j<numCols;j++){
      if (j > 1) output += ', ';
         output += '"'+header[j]+'" : '+escapeInput(row[j]);
    }
    output += '}';
  }
  output += '], "timestamp": "'+new Date().toString()+'"}';

  //Logger.log(output);
  saveToS3(output);
}

// attempt to make content json friendly
function escapeInput(s) {
  return JSON.stringify(s.toString());
}

// push to S3 bucket
function saveToS3(blob) {
  // see S3.gs
  var awsAccessKey = documentProperties.getProperty('AWS_ACCESS_KEY');
  var awsSecretKey = documentProperties.getProperty('AWS_SECRET_KEY');
  var bucket = documentProperties.getProperty('AWS_BUCKET');
  var projectPath = documentProperties.getProperty('PROJECT_PATH') + '/latest.json';

  var s3 = S3.getInstance(awsAccessKey, awsSecretKey);
  s3.putObject(bucket, projectPath, blob, {logRequests:false});
}
