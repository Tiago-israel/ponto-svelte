<script>
  import { createEventDispatcher } from "svelte";

  export let id;
  export let value;

  const dispatch = createEventDispatcher();

  const click = () => {
    dispatch("click");
  };
</script>

<span class="switch">
  <input type="checkbox" {id} checked={value}  on:click="{click}"/>
  <label for={id} />
</span>

<style lang="scss">
  .switch {
    display: inline-block;
    width: 58px;
    height: 28px;

    vertical-align: top;

    label {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 20px;
      border: 2px solid #cacaca;
      background-color: #000;
      background-color: #fff;
      cursor: pointer;

      &::after {
        content: "☀️";
        position: absolute;
        top: 50%;
        left: 2px;
        transform: translateY(-50%);
        width: 21px;
        height: 21px;
        border-radius: 50%;
        background-color: #cacaca;
        font-size: 12px;
        text-align: center;
        transition: all 0.15s ease-in-out;
      }
    }

    input {
      display: none;

      &:checked + label {
        background-color: #000;
        border-color: rgb(251 191 36);
        color: #fff;

        &::after {
          content: "🌙";
          left: 31px;
          color: #000;
          background-color: rgb(251 191 36);
        }
      }
    }
  }
</style>
