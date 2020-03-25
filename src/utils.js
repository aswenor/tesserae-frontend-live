export function toTitleCase(str) {
    return str.toLowerCase.split().map(item => {
        if (item.length > 1) {
            return item.charAt(0).toUpperCase + item.substring(1)
        }
        else {
            return item
        }
    }).join(' ');
}


export function getTotalWidth() {
    return window.innerWidth !== null
      ? window.innerWidth
      : window.document.documentElement.clientWidth
}