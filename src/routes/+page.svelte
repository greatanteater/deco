<script>
  import welcome from "$lib/images/svelte-welcome.webp";
  import welcome_fallback from "$lib/images/svelte-welcome.png";
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<canvas id="canvas"></canvas>

<style>
  #canvas {
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
