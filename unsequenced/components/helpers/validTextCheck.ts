export default function validTextCheck(text: string, previousEntries: string[], previousTitle?: string) {
  const whitespaceMatch = /^(\s+)/;
  const testOne = !text.match(whitespaceMatch);

  // We need to remove the current title from the array (if there is one)
  if (previousTitle) {
    const index = previousEntries.indexOf(previousTitle);
    previousEntries.splice(index, 1);
  }

  const testTwo = !previousEntries.includes(text);

  return testOne && testTwo;
}
