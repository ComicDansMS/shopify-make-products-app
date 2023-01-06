export default function stripFormatting(input) {
  const regex = /(\r\n|\n|\r|\d+.)/gm;
  
  return input.replace(regex, '');
}