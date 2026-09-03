/** Paste into the Google Sheet's Extensions > Apps Script editor.
 * Script Properties: SPREADSHEET_ID, RSVP_SECRET (a long random secret).
 * Deploy as web app: execute as yourself, access Anyone. The secret below
 * authenticates writes from the Vercel server. Do not share the Sheet publicly.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var config=PropertiesService.getScriptProperties();
    var body=JSON.parse(e.postData.contents);
    if(!config.getProperty('RSVP_SECRET')||body.secret!==config.getProperty('RSVP_SECRET'))throw new Error('Unauthorized');
    var deadline=config.getProperty('RSVP_DEADLINE')||'2026-09-08T23:59:59+08:00';
    if(Date.now()>Date.parse(deadline))throw new Error('Closed');
    if(!/^[a-f0-9]{64}$/.test(body.responseId)||typeof body.name!=='string'||body.name.length<2||body.name.length>120||typeof body.email!=='string'||body.email.length>254||!/^\S+@\S+\.\S+$/.test(body.email)||!['yes','no'].includes(body.attendance)||typeof body.note!=='string'||body.note.length>1500||body.consent!==true)throw new Error('Invalid');
    lock.waitLock(10000);
    var sheet=SpreadsheetApp.openById(config.getProperty('SPREADSHEET_ID')).getSheetByName('Responses');
    if(!sheet)throw new Error('Missing Responses sheet');
    var last=sheet.getLastRow();
    if(last>1&&sheet.getRange(2,1,last-1,1).createTextFinder(body.responseId).matchEntireCell(true).findNext())return json_({ok:true,responseId:body.responseId});
    sheet.appendRow([body.responseId,new Date().toISOString(),safe_(body.name),safe_(body.email),body.attendance==='yes'?'Yes':'No',safe_(body.note),'Yes']);
    SpreadsheetApp.flush();
    return json_({ok:true,responseId:body.responseId});
  }catch(error){return json_({ok:false})}finally{if(lock.hasLock())lock.releaseLock()}
}
function safe_(value){return /^[=+\-@\t\r]/.test(value)?"'"+value:value}
function json_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)}
