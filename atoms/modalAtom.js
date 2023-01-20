import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const editState = atom({
  key: "editState",
  default: false,
});

export const postIdState = atom({
  key: "postIdState",
  default: "",
});

export const editIdState = atom({
  key: "editIdState",
  default: "",
});

export const inputText = atom({
  key: "inputText",
  default: "",
});

export const selectedImage = atom({
  key: "selectedImage",
  default: null,
});

