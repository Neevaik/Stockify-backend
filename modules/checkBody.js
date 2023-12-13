function checkBody(body, keys) {
  let isValid = true;
  const regex = /^\s*$/; // Regex pour vérifier si toute la chaîne est composée d'espaces

  for (const field of keys) {
    if (body[field]) {
      body[field] = body[field].replace(/\s+/g, ' '); // Remplacer les espaces supplémentaires
    }
    if (!body[field] || body[field] === '' || regex.test(body[field])) {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody };