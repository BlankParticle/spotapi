<script lang="ts">
  let track: string = "4PTG3Z6ehGkBFwjybzWkR8";
</script>

<main>
  <h1>Paste Track Id</h1>
  <h2>Enter any song's track id</h2>
  <input type="text" bind:value={track} />
  <a href="/api/{track}" class="fetch">Fetch Lyrics</a>
  <a href="https://github.com/BlankParticle/spotapi" class="source" target="_blank"
    >Source Code here</a
  >
</main>

<style>
  main {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .source {
    margin-top: 2rem;
  }
</style>
