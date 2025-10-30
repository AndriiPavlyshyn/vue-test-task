<script lang="ts" setup>
import BetSlip  from '@/components/BetSlip.vue';
import GameList from '@/components/GameList.vue';
</script>

<template>
	<div class="grid grid-cols-[30%_1fr] gap-4 py-4">
		<BetSlip />
		<GameList />
	</div>
</template>

<style lang="scss" scoped>

</style>
