fetch("https://www.exito.com")
  .then((res) => res.text())
  .then((html) => {
    console.log("HTML recibido:");
    console.log(html.slice(0, 300));
  })
  .catch((err) => console.error(err));
