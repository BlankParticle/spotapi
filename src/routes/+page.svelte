<script lang="ts">
  let track: string = "4PTG3Z6ehGkBFwjybzWkR8";
</script>

<h1>Paste Track Id</h1>
<pre>Use `playerctl metadata` to get currently playing song's track id</pre>
<input type="text" bind:value={track} style:display="block" />
<a href="/api/{track}">Fetch</a>
