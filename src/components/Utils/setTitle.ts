function setTitle(title?: string): void {
  if (!title) {
    document.title = "Monity";
    return;
  }
  document.title = `Monity - ${title}`;
}

export { setTitle };
