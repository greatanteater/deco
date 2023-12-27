<script lang="ts">
  import { onMount } from "svelte";
  import PixiApp from "../activity/PixiApp";

  let canvas: HTMLCanvasElement;

  onMount(() => {
    console.log("onMounted");
    const pixiApp = new PixiApp(canvas);
	pixiApp.startScene();

	return () => {
        pixiApp.closeScene();
    };
  });
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<canvas bind:this={canvas} id="canvas"></canvas>

<style>
  #canvas {
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
