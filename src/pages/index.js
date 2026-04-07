import "./index.css";
import {
  validationConfig,
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { handleSubmit } from "../utils/utils.js"; // Importing the new utility

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "207898a2-0554-4c68-bb47-005574d1ce95",
    "Content-Type": "application/json",
  },
});

// --- Elements ---
const allModals = document.querySelectorAll(".modal");
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

// Profile Elements
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description",
);
const profileAvatarElement = document.querySelector(".profile__avatar");

// Edit Profile Modal
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

// New Post Modal
const newPostModal = document.querySelector("#new-post-modal");
const newPostButton = document.querySelector(".profile__add-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostNameInput = newPostModal.querySelector("#card-caption-input");

// Avatar Modal
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarLinkInput = editAvatarModal.querySelector(
  "#profile-avatar-input",
);

// Delete Modal
const deleteCardModal = document.querySelector("#delete-modal");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");

// Preview Modal
const previewModal = document.querySelector("#preview-modal");
const previewImageElement = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

let selectedCard, selectedCardId;

// --- Functions ---

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
}

const closeOnEscape = (event) => {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_is-opened");
    if (modal) closeModal(modal);
  }
};

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;
  cardTitleElement.textContent = data.name;

  if (data.isLiked) cardLikeButton.classList.add("card__like-button_active");

  cardLikeButton.addEventListener("click", (evt) =>
    handleLikeState(evt, data._id),
  );
  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id),
  );
  cardImageElement.addEventListener("click", () => {
    previewImageElement.src = data.link;
    previewImageElement.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// --- Submit Handlers (Refactored) ---

function handleEditProfileSubmit(evt) {
  function makeRequest() {
    return api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((data) => {
        profileNameElement.textContent = data.name;
        profileDescriptionElement.textContent = data.about;
        closeModal(editProfileModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleAddCardSubmit(evt) {
  function makeRequest() {
    return api
      .addNewCard({
        name: newPostNameInput.value,
        link: newPostLinkInput.value,
      })
      .then((data) => {
        const cardElement = getCardElement(data);
        cardsList.prepend(cardElement);
        closeModal(newPostModal);
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleEditAvatarSubmit(evt) {
  function makeRequest() {
    return api.editAvatar(editAvatarLinkInput.value).then((data) => {
      profileAvatarElement.src = data.avatar;
      closeModal(editAvatarModal);
    });
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    });
  }
  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleLikeState(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_active");
  api
    .changeLikeState(id, isLiked)
    .then(() => evt.target.classList.toggle("card__like-button_active"))
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteCardModal);
}

// --- Event Listeners ---

editProfileButton.addEventListener("click", () => {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig,
  );
  openModal(editProfileModal);
});

newPostButton.addEventListener("click", () => {
  newPostForm.reset(); // Clear form before opening
  resetValidation(
    newPostForm,
    [newPostLinkInput, newPostNameInput],
    validationConfig,
  );
  openModal(newPostModal);
});

editAvatarButton.addEventListener("click", () => {
  editAvatarForm.reset();
  resetValidation(editAvatarForm, [editAvatarLinkInput], validationConfig);
  openModal(editAvatarModal);
});

allModals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (
      evt.target.classList.contains("modal_is-opened") ||
      evt.target.classList.contains("modal__close-button")
    ) {
      closeModal(modal);
    }
  });
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);
editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);
deleteCardForm.addEventListener("submit", handleDeleteSubmit);

// --- Initialization ---

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => cardsList.append(getCardElement(item)));
    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    profileAvatarElement.src = userData.avatar;
  })
  .catch(console.error);

enableValidation(validationConfig);
