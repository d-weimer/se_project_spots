class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "207898a2-0554-4c68-bb47-005574d1ce95",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
