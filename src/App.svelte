<script>
	let result = undefined;
	const form = {
		startHour: 0,
		startMinutes: 0,
		shortDay: false,
		computeLunchBreak: true
	};
	const hours = Array(24).fill().map((_, index) => ({
		value: index,
		formatedValue: index < 10 ? `0${index}` : index
	}));
	const minutes = Array(60).fill().map((_, index) => ({
		value: index,
		formatedValue: index < 10 ? `0${index}` : index
	}));
	

	function handleSubmit(){
		result = getWorkJourneyInfo(form);
	}

	function getWorkJourneyInfo({ startHour = 0, startMinutes = 0, shortDay = false, computeLunchBreak = true })
	{
		if(startHour > 23 || startHour  < 0) throw new Error("error");
		if(startMinutes > 59 || startMinutes < 0) throw new Error("error");
		
		const lunchBreakMinutes = 90;
		
		const shortDayHours = 6;
		const normalDayHours = 8;
		
		const shortDayMinutes = 40;
		const normalDayMinutes = 20;
		
		let start = new Date();
		
		start.setHours(0,0,0,0);
		start.setHours(startHour, startMinutes);
		let startTime = `${start.getHours()}:${start.getMinutes()}`

		start.setMinutes(start.getMinutes() +  (computeLunchBreak ? lunchBreakMinutes : 0));
		start.setHours( start.getHours() + (shortDay ? shortDayHours : normalDayHours));
		start.setMinutes(start.getMinutes() + (shortDay ? shortDayMinutes : normalDayMinutes));

		let endTime = `${start.getHours()}:${start.getMinutes()}`;

		return {startTime, endTime };
	}
</script>

<main>
	<h1 class="text-4xl text-center text-green-500 mb-5">Calcular horário de saída</h1>
	<div class="main-container">
		<form on:submit|preventDefault={handleSubmit}>
			<div class="flex">
				<select class="p-2 select w-100" bind:value="{form.startHour}">
					{#each hours as hour}
						<option value="{hour.value}">{hour.formatedValue}</option>
					{/each}
				</select>
				<span class="mx-2">:</span>
				<select class="select p-2 w-100" bind:value="{form.startMinutes}">
					{#each minutes as minute}
						<option value="{minute.value}">{minute.formatedValue}</option>
					{/each}
				</select>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<div class="flex items-center gap-2">
						<input type="checkbox"  bind:checked={form.shortDay}/>
						<span>Sexta feira curta</span>
					</div>
					<div class="flex items-center gap-2">
						<input type="checkbox"  bind:checked={form.computeLunchBreak}/>
						<span>Adicionar horário de almoço (1h:30min)</span>
					</div>
				</div>
				<button class="bg-green-500 text-white font-bold p-2">Calcular</button>
			</div>
		</form>
		{#if result !== undefined}
			<h1 class="text-3xl text-red-500 text-center mt-5">Horário saída {result.endTime}</h1>
		{/if}
	</div>
</main>

<style>
	.w-100 {
		width: 100%;
	}
	
	.main-container {
		width: 450px;
		margin: 0 auto;
	}

</style>