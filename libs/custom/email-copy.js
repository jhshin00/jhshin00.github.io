const emailButton = document.querySelector("[data-copy-email]");

if (emailButton) {
  let copying = false;

  const copyEmail = async () => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(emailButton.dataset.copyEmail);
        return;
      } catch {
        // Use selection-based copying when the Clipboard API is unavailable or denied.
      }
    }

    const field = document.createElement("textarea");
    field.value = emailButton.dataset.copyEmail;
    field.readOnly = true;
    field.style.cssText = "position: fixed; top: 0; left: 0; opacity: 0; font-size: 16px;";
    document.body.append(field);
    field.select();
    field.setSelectionRange(0, field.value.length);

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      field.remove();
      emailButton.focus({ preventScroll: true });
    }
    if (!copied) throw new Error("Email could not be copied");
  };

  emailButton.addEventListener("click", async () => {
    if (copying) return;
    copying = true;
    try {
      await copyEmail();
    } catch {
      console.warn("Email could not be copied to the clipboard.");
    } finally {
      copying = false;
    }
  });
}
