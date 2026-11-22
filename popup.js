// Saves the popup switches in chrome.storage.sync. content.js listens for changes,
// so open YouTube tabs update without a reload. Shorts are not stored here: they are
// always blocked and the popup has no way to turn that off.
const inputs = [...document.querySelectorAll("input[data-option]")];
const keys = inputs.map((input) => input.dataset.option);

chrome.storage.sync.get(keys, (values) => {
  for (const input of inputs) input.checked = values[input.dataset.option] === true;
});

for (const input of inputs) {
  input.addEventListener("change", () => {
    chrome.storage.sync.set({ [input.dataset.option]: input.checked });
  });
}
