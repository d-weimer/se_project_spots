import "./index.css";
import {
  validationConfig,
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "207898a2-0554-4c68-bb47-005574d1ce95",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileNameElement.textContent = userData.name;
    profileDescriptionElement.textContent = userData.about;
    profileAvatarElement.src = userData.avatar;
  })
  .catch(console.error);

const allModals = document.querySelectorAll(".modal");

// Edit Profile
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button",
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);
const editProfileSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button",
);

// New Post
const newPostModal = document.querySelector("#new-post-modal");
const newPostButton = document.querySelector(".profile__add-button");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostSubmitButton = newPostForm.querySelector(".modal__submit-button");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostNameInput = newPostModal.querySelector("#card-caption-input");

// Edit Avatar
const profileAvatarElement = document.querySelector(".profile__avatar");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description",
);
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarCloseButton = editAvatarModal.querySelector(
  ".modal__close-button",
);
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarLinkInput = editAvatarModal.querySelector(
  "#profile-avatar-input",
);
const editAvatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit-button",
);

// Delete Cards
const deleteCardModal = document.querySelector("#delete-modal");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");
const deleteCardCloseButton = deleteCardModal.querySelector(
  ".modal__close-button",
);
const deleteCardSubmitButton = deleteCardModal.querySelector(
  ".modal__submit-button-delete-card",
);
const deleteCardCancelButton = deleteCardModal.querySelector(
  ".modal__submit-button-delete-card-cancel",
);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button",
);
const previewImageElement = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;
  cardTitleElement.textContent = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_active");
  }

  cardLikeButton.addEventListener("click", (evt) =>
    handleLikeState(evt, data._id),
  );

  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
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

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
}

allModals.forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

const closeOnEscape = (event) => {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_is-opened");
    if (modal) {
      closeModal(modal);
    }
  }
};

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig,
  );
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

editAvatarButton.addEventListener("click", function () {
  openModal(editAvatarModal);
});

editAvatarCloseButton.addEventListener("click", function () {
  closeModal(editAvatarModal);
});

deleteCardCloseButton.addEventListener("click", function () {
  closeModal(deleteCardModal);
});

deleteCardCancelButton.addEventListener("click", function () {
  closeModal(deleteCardModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const initialButtonText = editProfileSubmitButton.textContent;
  editProfileSubmitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      disableButton(editProfileSubmitButton, validationConfig);
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      editProfileSubmitButton.textContent = initialButtonText;
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostNameInput.value,
    link: newPostLinkInput.value,
  };

  const initialButtonText = newPostSubmitButton.textContent;
  newPostSubmitButton.textContent = "Saving...";

  api
    .addNewCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);

      newPostForm.reset();
      resetValidation(
        newPostForm,
        [newPostLinkInput, newPostNameInput],
        validationConfig,
      );
      disableButton(newPostSubmitButton, validationConfig);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      newPostSubmitButton.textContent = initialButtonText;
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();

  const initialButtonText = editAvatarSubmitButton.textContent;
  editAvatarSubmitButton.textContent = "Saving...";

  api
    .editAvatar(editAvatarLinkInput.value)
    .then((data) => {
      profileAvatarElement.src = data.avatar;

      editAvatarForm.reset();
      resetValidation(editAvatarForm, editAvatarLinkInput, validationConfig);
      disableButton(editAvatarSubmitButton, validationConfig);
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      editAvatarSubmitButton.textContent = initialButtonText;
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteCardModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const initialButtonText = deleteCardSubmitButton.textContent;
  deleteCardSubmitButton.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteCardSubmitButton.textContent = initialButtonText;
    });
}

function handleLikeState(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_active");

  api
    .changeLikeState(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch((err) => {
      console.error(err);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);
editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);
deleteCardForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(validationConfig);
