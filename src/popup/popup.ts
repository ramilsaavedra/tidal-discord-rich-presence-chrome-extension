let btn = document.getElementById('optionBtn');

if (btn) {
  btn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

window.addEventListener('load', async () => {
  console.log('Hello world');
});
