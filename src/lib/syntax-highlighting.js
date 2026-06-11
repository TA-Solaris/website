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

function getCodeLanguage(codeElement) {
  const languageClass = [...codeElement.classList].find((className) =>
    className.startsWith("language-"),
  );

  if (!languageClass) return null;

  const language = languageClass.replace("language-", "");
  return languageAliases[language] ?? language;
}

export function applySyntaxHighlighting(container) {
  container.querySelectorAll("pre > code[class*='language-']").forEach((code) => {
    const language = getCodeLanguage(code);

    if (!language || !hljs.getLanguage(language)) return;

    const { value } = hljs.highlight(code.textContent, {
      language,
      ignoreIllegals: true,
    });

    code.classList.add("hljs");
    code.innerHTML = value;
  });
}
