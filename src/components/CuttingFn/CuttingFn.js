export default function CuttingFn(text , symbols) {
    if (text.length <= symbols) {
      return text;
    }
    const overview = text.substring(0, symbols - 1);
    return `${overview.substring(0, overview.lastIndexOf(' '))}...`;
  }
