import { writable } from "svelte/store";

const user = writable(
  JSON.parse(localStorage.getItem("user")) || {
    id: "",
    name: "",
    email: "",
    avatar: "",
  }
);

user.subscribe((user) => {
  localStorage.setItem("user", JSON.stringify(user));
});

export default user;
