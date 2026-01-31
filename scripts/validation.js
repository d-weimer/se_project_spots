const showInputError = (formElement, inputElement, errorMessage) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`,
  );
  inputElement.classList.add("modal__input_type_error");
  errorMessageElement.textContent = errorMessage;
};

const hideInputError = (formElement, inputElement) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`,
  );
  inputElement.classList.remove("modal__input_type_error");
  errorMessageElement.textContent = "";
};

const resetValidation = (formElement, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input);
  });
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
  buttonElement.classList.add("button_inactive");
};

const enableButton = (buttonElement) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove("button_inactive");
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
  } else {
    enableButton(buttonElement);
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__submit-button");

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");

  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

enableValidation();
