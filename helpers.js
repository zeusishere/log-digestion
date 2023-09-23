/*
 * formats date as a string in YYYY-MMMM-DD HH:MM
 * {string} dateString
 * {string}
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  // Get the time components
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
};

/*
 *   enables string to wrap over multiple lines if it exceeds maxLength
 *   {string} text
 *   {maxLength} number of characters after which text should wrap
 */
const wrapText = (text, maxLength = 50) => {
  let formattedText = "";
  let index = 0;
  while (index < text.length) {
    formattedText += text.substring(index, index + maxLength) + "\n";
    index += maxLength;
  }
  return formattedText;
};

module.exports = { wrapText, formatDate };
