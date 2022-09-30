# Search Replace Action

A action to replace/delete regex-matched patterns in files.

### Usage

Add it to the steps of a workflow.
The `replacement_file` input is the path to the file specifying the replacements and the optional `dir` input is a path prefix that will be prepended to all file paths specified in the `replacement_file`.

```
  .
  .
  .
    steps:
      - uses: UbiqueInnovation/workflows-web/workflows/webflow-azure-blobstorage-upload.yml@SB-59
        with:
          replacement_file: <replacement_file>
          dir: "unzipped"
  .
  .
  .
```

The `replacement_file` should have the following structure:

```
edits:
 - file: "./file-to-edit.js"
   pattern: "regex pattern which sould be replaced"
   replace: "what the pattern should be replaced with"
 - file: "./2nd-file-to-edit.js"
   pattern: "regex pattern which sould be replaced"
   replace: "what the pattern should be replaced with"
.
.
.
```
