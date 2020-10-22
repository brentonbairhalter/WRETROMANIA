# retro-generator
[Google Apps Scripting](https://developers.google.com/apps-script) to generate retro Google Doc

This generator is used to create and prefill our retrospectives template with the names and initials of the attendees.

## Setup

1. Navigate to your [Google Drive](https://drive.google.com/drive/my-drive)
2. Select the folder where you want your retrospective docs to live
3. Request access to the [Atendees sheet](https://docs.google.com/spreadsheets/d/1agtroGoY78fsVVBnQpMmAUx7ktVw7hkpI8aroTk8rx8/edit#gid=0)
    * Make a copy of this sheet and move to your preferred folder from step 2
        * If you would like to share a sheet, add to the [sheets list](/sheets/sheets.md) and pr
4. Request access to the [Retro Generator Template Document](https://docs.google.com/document/d/186x2do67hk7mGlbBkkgZWMC4v-tTL38NGSaWPrHthYM/edit)
    * Make a copy of this doc and move to the preferred folder from step 2
        * Adjust the content to meet your needs.
        * If you would like to share a document template, add to the [docs list](docs/docs.md) and pr
        * The items surrounded by ## (ex: "##TITLE##") indicate the replacement fields
            * This can be adjusted in the gs script if you choose a different pattern
5. Open up your copy of the Attendees sheet
6. Click Tools > Script Editor
7. Replace the `sheet_id` value with the id of your Attendees sheet
    * ex: https://docs.google.com/spreadsheets/d/1agtroGoY78fsVVBnQpMmAUx7ktVw7hkpI8aroTk8rx8/edit#gid=0
    * `var sheet_id = '1agtroGoY78fsVVBnQpMmAUx7ktVw7hkpI8aroTk8rx8';`
8. Replace the `template_doc_id` value with the id of your Retro Generator Template Document
    * ex: https://docs.google.com/document/d/186x2do67hk7mGlbBkkgZWMC4v-tTL38NGSaWPrHthYM/edit
    * `var template_doc_id = '186x2do67hk7mGlbBkkgZWMC4v-tTL38NGSaWPrHthYM';`
9. Replace the `parent_folder_id` value with the id of the root retros folder
    * ex: https://drive.google.com/drive/folders/1n6ipxLyykKWzc0_NTGJ_MXrWV7mfP6Xd
    * `var parent_folder_id = '1n6ipxLyykKWzc0_NTGJ_MXrWV7mfP6Xd';`
10. Do a quick spot check to ensure the `cells` values match the cell ranges from your Attendees sheet
11. Give it a trial run, the first time through it will ask to grant permissions for the Google Apps script.  This exits non-zero and will need to be run again after granting access.

## Usage

* At the start of the retro meeting head to your Attendees sheet and populate the necessary cells
* Click the custom menu that was added (╰( ⁰ ਊ ⁰ )━☆ﾟ.*･｡ﾟ)
* Select "Create Retro Doc"
  * This will make a copy of the template and populate/replace the macros with content entered in the spreadsheet
  * The copied sheet will be saved in a folder for the Team Name value
    * It checks if it exists and creates one if not
  * There should be a dialog that indicates the script has completed.  Now a new menu option is added to the custom menu
* Click "Copy Link"
  * This will open a modal that you can double click and copy for sharing with the team
  * Still investigating if it can copy to clipboard
