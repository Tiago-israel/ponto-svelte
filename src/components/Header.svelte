<script>
  import { onMount } from "svelte";
  import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
  } from "firebase/firestore";
  import userStore from "../store/user";
  import Modal from "./Modal.svelte";
  import api from "../firebase/api";
  import IconGithub from "../assets/github.svg";
  import IconGmail from "../assets/google-logo.svg";
  import IconUser from "../assets/user.svg";

  export let darkMode;

  let userInfo = {};
  let modalIsOpen = false;
  let dropdownIsOpen = false;

  function toggleModal() {
    modalIsOpen = !modalIsOpen;
  }

  async function githubLogin() {
    const result = await api.githubAuth();
    updateUserStore(result.user);
    toggleModal();
    await gravarUsuario(result.user);
  }

  async function googleLogin() {
    const result = await api.googleAuth();
    updateUserStore(result.user);
    toggleModal();
    await gravarUsuario(result.user);
  }

  function updateUserStore(user) {
    userStore.set({
      id: user.uid,
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL,
    });
  }

  async function gravarUsuario(user) {
    const db = api.db();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(collection(db, "users"), {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });
    }
  }

  function userLogout() {
    toggleDropDown();
    updateUserStore({});
  }

  function toggleDropDown() {
    dropdownIsOpen = !dropdownIsOpen;
  }

  onMount(async () => {
    userStore.subscribe((user) => {
      userInfo = user;
    });
  });
</script>

<header class="bg-amber-400 flex items-center justify-end px-4">
  <div class="flex items-center h-full justify-end gap-4 header-content">
    {#if userInfo.name}
      <span class="font-bold">{userInfo.name}</span>
      <div class="relative">
        <img
          class="cursor-pointer"
          src={userInfo.avatar}
          alt="avatar"
          on:click={toggleDropDown}
        />
        {#if dropdownIsOpen}
          <div class="dropdown absolute {darkMode ? 'dark' : 'light'}">
            <span class="cursor-pointer block" on:click={userLogout}>Sair</span>
          </div>
        {/if}
      </div>
    {:else}
      <div class="flex gap-3 cursor-pointer" on:click={toggleModal}>
        <IconUser/>
        <span class="font-bold">Login</span>
      </div>
    {/if}
  </div>
  <Modal
    isOpen={modalIsOpen}
    handleState={toggleModal}
    title="Efetuar login com"
    darkmode={darkMode}
  >
    <div class="flex flex-col">
      <button
        class="flex justify-center gap-4 p-1 mb-2 bg-amber-400 "
        on:click={googleLogin}
      >
        <div class="icon-gmail-container">
          <IconGmail />
        </div>
        Login com google
      </button>
      <button
        class="flex justify-center gap-4 p-1 bg-amber-400"
        on:click={githubLogin}
      >
        <IconGithub />
        Login com github
      </button>
    </div>
  </Modal>
</header>

<style lang="scss">
  header {
    height: 60px;
    .header-content {
      width: 450px;
      margin: 0 auto;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .icon-gmail-container {
      width: 24px;
      height: 24px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }

    .dropdown {
      width: 100px;
      top: 44px;
      right: 0px;
      padding: 16px;
      background-color: #fff;
      z-index: 9999;

      &.light {
        border: 1px solid #ccc;
      }

      &.dark {
        border: 1px solid #ccc;
      }
    }
  }
</style>
