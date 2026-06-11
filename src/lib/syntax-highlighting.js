import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import nix from "highlight.js/lib/languages/nix";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("nix", nix);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("sql", sql);

const languageAliases = {
  sh: "bash",
};

const languageLabels = {
  bash: "SH",
  nix: "NIX",
  sh: "SH",
  shell: "SH",
  sql: "SQL",
};

const actionOverlapGap = 8;
const measurementCanvas = document.createElement("canvas");

function getCodeLanguage(codeElement) {
  const languageClass = [...codeElement.classList].find((className) =>
    className.startsWith("language-"),
  );

  if (!languageClass) return null;

  const language = languageClass.replace("language-", "");
  return languageAliases[language] ?? language;
}

function getCodeLanguageLabel(codeElement) {
  const languageClass = [...codeElement.classList].find((className) =>
    className.startsWith("language-"),
  );

  if (!languageClass) return "CODE";

  const language = languageClass.replace("language-", "");
  return languageLabels[language] ?? language.toUpperCase();
}

function addCodeBlockControls(codeElement) {
  const pre = codeElement.closest("pre");
  if (!pre || pre.querySelector(":scope > .code-block-actions")) return;

  const actions = document.createElement("span");
  actions.className = "code-block-actions";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-code-button";
  button.setAttribute("aria-label", "Copy code");
  button.textContent = "Copy";

  const language = document.createElement("span");
  language.className = "code-language-label";
  language.textContent = getCodeLanguageLabel(codeElement);

  actions.append(button, language);
  pre.prepend(actions);
}

function getFirstLineWidth(codeElement) {
  const firstLine = (codeElement.textContent ?? "").split(/\r?\n/, 1)[0];
  if (!firstLine) return 0;

  const styles = window.getComputedStyle(codeElement);
  const context = measurementCanvas.getContext("2d");
  context.font = styles.font;

  return context.measureText(firstLine).width;
}

function getInlineStart(element) {
  const styles = window.getComputedStyle(element);
  return Number.parseFloat(styles.paddingLeft) || 0;
}

function getActionRightOffset(actions) {
  const styles = window.getComputedStyle(actions);
  return Number.parseFloat(styles.right) || 0;
}

export function updateCodeBlockActionSpacing(container) {
  container.querySelectorAll("pre > .code-block-actions").forEach((actions) => {
    const pre = actions.closest("pre");
    const code = pre?.querySelector("code");

    if (!pre || !code) return;

    const actionsLeftEdge =
      pre.clientWidth - getActionRightOffset(actions) - actions.offsetWidth;
    const availableFirstLineWidth =
      actionsLeftEdge - getInlineStart(pre) - actionOverlapGap;
    const firstLineWidth = getFirstLineWidth(code);

    pre.classList.toggle(
      "code-block-actions-overlap",
      firstLineWidth > availableFirstLineWidth,
    );
  });
}

export function applySyntaxHighlighting(container) {
  container.querySelectorAll("pre > code[class*='language-']").forEach((code) => {
    const language = getCodeLanguage(code);

    addCodeBlockControls(code);

    if (!language || !hljs.getLanguage(language)) return;

    const { value } = hljs.highlight(code.textContent, {
      language,
      ignoreIllegals: true,
    });

    code.classList.add("hljs");
    code.innerHTML = value;
  });
}
