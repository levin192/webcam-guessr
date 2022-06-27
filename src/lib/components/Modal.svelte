<script>
  import { createEventDispatcher, onDestroy } from 'svelte'
  import IconButton from '@smui/icon-button'

  const dispatch = createEventDispatcher()
  const close = () => dispatch('close')

  let modal

  const handle_keydown = e => {
    if (e.key === 'Escape') {
      close()
      return
    }

    if (e.key === 'Tab') {
      // trap focus
      const nodes = modal.querySelectorAll('*')
      const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0)

      let index = tabbable.indexOf(document.activeElement)
      if (index === -1 && e.shiftKey) index = 0

      index += tabbable.length + (e.shiftKey ? -1 : 1)
      index %= tabbable.length

      tabbable[index].focus()
      e.preventDefault()
    }
  }

  const previously_focused = typeof document !== 'undefined' && document.activeElement

  if (previously_focused) {
    onDestroy(() => {
      previously_focused.focus()
    })
  }
</script>

<svelte:window on:keydown={handle_keydown}/>

<div class="modal-background" on:click={close}></div>

<div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
    <div class="modal-head">
        <div class="modal-head-slot">
            <slot name="header"></slot>
        </div>
        <!-- svelte-ignore a11y-autofocus -->
        <IconButton class="material-icons" autofocus on:click={close}>close</IconButton>
    </div>
    <slot></slot>
</div>

<style lang="scss">
  .modal {
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(80vw - 4em);
    max-height: calc(100vh - 4em);
    overflow: visible;
    transform: translate(-50%, -50%);
    padding: 1rem 2rem;
    border-radius: 4px;
    background: var(--background-color);
    box-shadow: #161616 0 0 70px 15px;
    z-index: 5;
    &-head {
      display: flex;
      align-items: center;

      &-slot {
        margin-right: auto;
      }
    }

    &-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
    }
  }

</style>