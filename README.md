# avery-labels

This is some stuff I hacked together to print Avery 8160 labels.

## Usage

Make a spreadsheet of addresses with the following columns:

- Name on Envelope
- Address 1
- Address 2
- City
- State
- Zip
- Country (optional

Export it as a CSV file and save it as `contacts.csv`.

Then run:

```sh
node generate.js
```

This will write a file called `index.html` which you can open in a browser and print.

## Possible Improvements

- Use CSS selectors instead of HTML to split up the pages
- Use CSS variables to make it easier to change label sizes
- Add a selector to the generated page (that is not printed) for different Avery label types
