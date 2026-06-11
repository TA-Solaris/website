const noticeLabels = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

export function applyMarkdownNoticeBlocks(container) {
  container.querySelectorAll("blockquote").forEach((blockquote) => {
    const firstParagraph = blockquote.firstElementChild;
    const firstText = firstParagraph?.firstChild;

    if (firstParagraph?.tagName !== "P" || firstText?.nodeType !== 3) {
      return;
    }

    const marker = firstText.nodeValue.match(
      /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][\t ]*(?:\r?\n)?/i,
    );

    if (!marker) return;

    const type = marker[1].toLowerCase();
    firstText.nodeValue = firstText.nodeValue.slice(marker[0].length);

    if (!firstParagraph.textContent.trim()) {
      firstParagraph.remove();
    }

    const title = document.createElement("p");
    title.className = "notice-title";
    title.textContent = noticeLabels[type];

    blockquote.classList.add("notice", `notice-${type}`);
    blockquote.prepend(title);
  });
}
