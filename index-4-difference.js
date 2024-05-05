const fs = require('fs');
const diff = require('diff');

// Read the files
const file1 = fs.readFileSync('./txt/webcontent-ptprogress-1.txt', 'utf8');
const file2 = fs.readFileSync('./txt/webcontent-ptprogress-2.txt', 'utf8');

// Compare the files
// const differences = diff.diffChars(file1, file2);
const differences = diff.diffWords(file1, file2);

// Calculate the percentage of differences
let changedChars = 0;
let totalChars = file1.length + file2.length;

differences.forEach(part => {
  // Green for additions, red for deletions
  // Grey for common parts
  const status = part.added ? 'Added' :
    part.removed ? 'Removed' : 'Unchanged';

  if (status !== 'Unchanged') {
    changedChars += part.count;
    // Output the parts with status
    console.log(`${status}: ${part.value}`);
  }
});

const differencePercentage = (changedChars / totalChars) * 100;
console.log(`\nDifference: ${differencePercentage.toFixed(2)}%`);