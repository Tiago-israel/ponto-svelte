<script>
  export let darkmode = true;
  export let handleState = () => {};
  export let title = "";
  export let isOpen = false;
</script>

<div class="{isOpen ? 'block' : 'hidden'} modal" on:click|self={handleState}>
  <div class="modal-content {darkmode ? 'dark' : 'light'}">
    <div class="modal-header flex items-center justify-between mb-2">
      <slot name="footer">
        <h2>{title}</h2>
      </slot>
      <span class="close" on:click={handleState}>&times;</span>
    </div>
    <div class="modal-body">
      <slot />
    </div>
    <div class="modal-footer">
      <slot name="footer" />
    </div>
  </div>
</div>

<style lang="scss">
  .modal {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);

    .modal-content {
      margin: auto;
      padding: 8px;
      background-color: #fefefe;
      border: 1px solid #888;
      width: 400px;

      .close {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;

        &:hover,
        &:focus {
          color: #000;
          text-decoration: none;
          cursor: pointer;
        }
      }
    }
  }
</style>
