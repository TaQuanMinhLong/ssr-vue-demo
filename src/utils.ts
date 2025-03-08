export function resetStyle(style: string) {
  for (const styleElement of document.head.querySelectorAll("style")) {
    styleElement.remove();
  }
  document.head.appendChild(document.createElement("style")).textContent = style;
}
