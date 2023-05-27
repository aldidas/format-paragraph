const titleField = document.getElementById("title-field");
const textField = document.getElementById("html-field");
const title = document.getElementById("title");
const app = document.getElementById("app");
const copyBtns = document.querySelectorAll(".copy-btn");
const clearBtn = document.getElementById("clear");

function chunk(array, size) {
  if (!array || !size) return [];
  const result = [];
  const groupNumber = Math.ceil(array.length / size);
  for(let i = 0; i < groupNumber; i++) {
    const start = i * size;
    const finish = start + size;
    const group = array.slice(start, finish);
    result.push(group);
  }
  return result;
}

function capitalize(string) {
  if (!string) return "";
  const strArr = string.split('');
  const [first, ...rest] = strArr;
  return [first.toUpperCase(), ...rest].join('');
}

function processString() {
  const titleText = titleField.value;
  const text = textField.value;
  const separated = text.split("\n");
  const [idblock, enblock, ...rest] = separated;

  let result = `<blockquote><p>${idblock}</p><p>${enblock}</p></blockquote>`;

  const chunkNumbers = (separated.length - 2) / 2;
  const chunked = chunk(rest, chunkNumbers);

  for (let i = 0; i < chunkNumbers; i++) {
    const idText = chunked[0][i];
    const enText = chunked[1][i];
    const chunkResult = `
      <div class="bilingual">
        <div class="id">
          <p>${idText}</p>
        </div>
        <div class="en">
          <p>${enText}</p>
        </div>
      </div>`;
    result = `${result}
    ${chunkResult}`;
  }

  title.innerHTML = titleText
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
  const escapedDoc = result.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  app.innerHTML = `<pre id="pre">${escapedDoc}</pre>`;
}

function clearData() {
  const confirm = window.confirm("Are you sure want to clear the form?");
  if (confirm) {
    titleField.value = "";
    textField.value = "";
    title.innerHTML = "";
    app.innerHTML = '<pre id="pre"></pre>';
    titleField.focus();
  }
}

function copyText(text = "") {
  const textTarget = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  console.log(textTarget);
  navigator.clipboard
    .writeText(textTarget)
    .then(() => console.log("copied to clipboard"))
    .catch((err) => console.log(`copy error, ${err}`));
}

titleField.addEventListener("input", processString);
textField.addEventListener("input", processString);

for (const btn of copyBtns) {
  btn.addEventListener("click", () => {
    const id = btn.id;
    const target = id.replace("copy-", "");
    const targetEle = document.getElementById(target);
    const textTarget = targetEle.innerHTML;
    copyText(textTarget);
  });
}

clearBtn.addEventListener("click", clearData);
