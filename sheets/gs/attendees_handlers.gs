var ui = SpreadsheetApp.getUi();
var custom_menu = ui.createMenu('╰( ⁰ ਊ ⁰ )━☆ﾟ.*･｡ﾟ');
var sheet_id = '1agtroGoY78fsVVBnQpMmAUx7ktVw7hkpI8aroTk8rx8'; //replace this with the id of your Attendees sheet.  ex: https://docs.google.com/spreadsheets/d/[[1agtroGoY78fsVVBnQpMmAUx7ktVw7hkpI8aroTk8rx8]]/edit#gid=0
var template_doc_id = '186x2do67hk7mGlbBkkgZWMC4v-tTL38NGSaWPrHthYM'; //replace this with the id of your Generator Template document.  ex: https://docs.google.com/document/d/[[186x2do67hk7mGlbBkkgZWMC4v-tTL38NGSaWPrHthYM]]/edit
var parent_folder_id = '1n6ipxLyykKWzc0_NTGJ_MXrWV7mfP6Xo'; //replace this with the id of the folder this all lives in.  ex: https://drive.google.com/drive/folders/[[1n6ipxLyykKWzc0_NTGJ_MXrWV7mfP6Xd]]
var cells = {
  aliases: 'C2:C',
  date: 'A2:A3',
  names: 'B2:B',
  retro_link: 'A4',
  team: 'E2',
  title: 'E3'
};

function onOpen() {
  manageCustomMenu(['create']);
}

function createHandler() {
  createDocument();
}

function copyHandler(){
  var link = SpreadsheetApp.getActiveSheet().getRange(cells.retro_link).getValue();
  ui.alert(link);  //@todo: can gas access clipboard?
}

function createDocument() {
  var date_raw = Sheets.Spreadsheets.Values.get(sheet_id, cells.date);
  var team_raw = Sheets.Spreadsheets.Values.get(sheet_id, cells.team);
  var title_raw = Sheets.Spreadsheets.Values.get(sheet_id, cells.title);
  var names_raw = Sheets.Spreadsheets.Values.get(sheet_id, cells.names);
  var aliases_raw = Sheets.Spreadsheets.Values.get(sheet_id, cells.aliases);
  var date_val = date_raw.values[0];
  var date_title_val = date_raw.values[1];
  var team_val = team_raw.values[0];
  var title_val =   title_raw.values && title_raw.values[0] ? title_raw.values[0] : team_val;
  var name_vals = names_raw.values.reverse();
  var alias_vals = aliases_raw ? aliases_raw.values.reverse(): name_vals;
  var team_folder = getOrCreateTeamFolder(team_val);
  var copied_doc_name = 'Retro: ' + team_val + ' - ' + date_title_val;
  var copied_doc_id = DriveApp.getFileById(template_doc_id).makeCopy(copied_doc_name, team_folder).getId();
  var copied_doc = DriveApp.getFileById(copied_doc_id);
  copied_doc.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  stashInCell(cells.retro_link, copied_doc.getUrl());

  var body = DocumentApp.openById(copied_doc_id).getBody();
  body.replaceText('##TITLE##', title_val);
  body.replaceText('##DATE##', date_val);

  //attendees list
  var name_pattern = "##NAMES-LIST##";
  var name_el = body.findText(name_pattern);
  var name_parent = name_el.getElement().getParent();
  name_parent.clear();
  var name_index = body.getChildIndex(name_parent);
  generateList(name_index + 1, body, alias_vals, name_vals, 1);

  //single responses
  var a1_pattern = "##ALIAS-LIST-1##";
  var a1_el = body.findText(a1_pattern);
  while(a1_el !== null){
    var a1_parent = a1_el.getElement().getParent();
    var a1_index = body.getChildIndex(a1_parent);
    generateList(a1_index + 1, body, alias_vals, null, 1);
    a1_el = body.findText(a1_pattern, a1_el);
  }
  body.replaceText(a1_pattern, '');

  //two responses
  var a2_pattern = "##ALIAS-LIST-2##";
  var a2_el = body.findText(a2_pattern);
  while(a2_el !== null){
    var a2_parent = a2_el.getElement().getParent();
    var a2_index = body.getChildIndex(a2_parent);
    generateList(a2_index + 1, body, alias_vals, null, 2);
    a2_el = body.findText(a2_pattern, a2_el);
  }
  body.replaceText(a2_pattern, '');

  manageCustomMenu(['create', 'copy']);
}

function generateList(index, body, aliases, names, dupes){
  for(var i = 0; i < (aliases.length); i++) {
    var display_string = '[' + aliases[i] +']: ';
    if (names && names[i]) {
      display_string += names[i];
    }
    for (var y = 0; y < dupes; y++) {
        body.insertListItem(index, display_string).setGlyphType(DocumentApp.GlyphType.BULLET)
    }
  }
}

function manageCustomMenu(opts){
  var menu_item_create_label = 'Create Retro Doc';
  var menu_item_create_action = 'createHandler';
  var menu_item_copy_label = 'Copy Link';
  var menu_item_copy_action = 'copyHandler';

  if (opts && opts.length > 0) {
    for (var o = 0; o < opts.length; o++) {
      if (opts[o] === 'create') {
        custom_menu.addItem(menu_item_create_label, menu_item_create_action);
      } else if (opts[o] === 'copy') {
        custom_menu.addItem(menu_item_copy_label, menu_item_copy_action);
      }
    }
    custom_menu.addToUi();
  }
}

function stashInCell(cell, value) {
  SpreadsheetApp.getActiveSheet().getRange(cell).setValue(value);
}

function getOrCreateTeamFolder(team_name) {
  var parent_folder = DriveApp.getFolderById(parent_folder_id);

  try {
    return parent_folder.getFoldersByName(team_name).next();
  } catch(e) {
    return parent_folder.createFolder(team_name);
  }
}
