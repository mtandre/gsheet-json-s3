# Google Spreasheet -> JSON -> S3 bucket
A Google Script to export Google Spreadsheets as JSON and upload them to AWS S3

Install

1. Spreadsheet menu: "Tools" > "Script Editor"
2. Add the 3 files and save
3. Reload spreadsheet

Usage:

1. AWS IAM credentials for an S3 bucket
2. Spreadsheet menu: "Datahub" > "Configuration" > "Set Configuration"
3. Enter Access key, Secret key, bucket name, bucket path (project name)
4. Spreadsheet menu: "Datahub" > "Export sheet as json"
5. Check bucket for file

TODO:

- [ ] Normalize column names (camelcase, remove numbers)
- [ ] Row value typing (numbers and booleans)
- [ ] Better config UI (sidebar)
- [ ] Archiving system (store and load(?) previous pushed versions)

