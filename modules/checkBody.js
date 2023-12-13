function checkBody(body, keys) {
  let isValid = true;
  const regex = /^\s*$/; // Regex pour vérifier si toute la chaîne est composée d'espaces

  for (const field of keys) {
    if (body[field]) {
      body[field] = body[field].replace(/\s+/g, ' ').trim(); // Remplacer les espaces supplémentaires et supprimer les espaces au début et à la fin
    }
    if (!body[field] || body[field] === '' || regex.test(body[field])) {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody };
