<script>
  let result = undefined;
  let interval = undefined;
  let showTimer = false;
  let countDown = "";
  const form = {
    startHour: 0,
    startMinutes: 0,
    shortDay: false,
    computeLunchBreak: true,
  };
  const hours = Array(24)
    .fill()
    .map((_, index) => ({
      value: index,
      formatedValue: index < 10 ? `0${index}` : index,
    }));
  const minutes = Array(60)
    .fill()
    .map((_, index) => ({
      value: index,
      formatedValue: index < 10 ? `0${index}` : index,
    }));

  function handleSubmit() {
    result = getWorkJourneyInfo(form);

    clearInterval(interval);

    interval = setInterval(function () {
      var firstDate = result.startDate.getTime();
      var countDownDate = result.endDate.getTime();

      var distance = countDownDate - firstDate;

      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countDown = hours + "h " + minutes + "m " + seconds + "s ";

      result.startDate.setSeconds(result.startDate.getSeconds() + 1);
      showTimer = true;
      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  function getWorkJourneyInfo({
    startHour = 0,
    startMinutes = 0,
    shortDay = false,
    computeLunchBreak = true,
  }) {
    if (startHour > 23 || startHour < 0) throw new Error("error");
    if (startMinutes > 59 || startMinutes < 0) throw new Error("error");

    const lunchBreakMinutes = 90;

    const shortDayHours = 6;
    const normalDayHours = 8;

    const shortDayMinutes = 40;
    const normalDayMinutes = 20;

    let start = new Date();

    start.setHours(0, 0, 0, 0);
    start.setHours(startHour, startMinutes);
    let startTimeStr = `${start.getHours()}:${start.getMinutes()}`;
    let startDate = new Date(start);

    start.setMinutes(
      start.getMinutes() + (computeLunchBreak ? lunchBreakMinutes : 0)
    );
    start.setHours(
      start.getHours() + (shortDay ? shortDayHours : normalDayHours)
    );
    start.setMinutes(
      start.getMinutes() + (shortDay ? shortDayMinutes : normalDayMinutes)
    );

    let endTimeStr = `${start.getHours()}:${start.getMinutes()}`;
    let endDate = start;

    return {
      startTimeStr,
      endTimeStr,
      startDate,
      endDate,
    };
  }
</script>

<main>
  <h1 class="text-4xl text-center text-amber-400 mb-5">
    Calcular horário de saída
  </h1>
  <div class="main-container">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="flex">
        <select class="p-2 select w-100" bind:value={form.startHour}>
          {#each hours as hour}
            <option value={hour.value}>{hour.formatedValue}</option>
          {/each}
        </select>
        <span class="mx-2">:</span>
        <select class="select p-2 w-100" bind:value={form.startMinutes}>
          {#each minutes as minute}
            <option value={minute.value}>{minute.formatedValue}</option>
          {/each}
        </select>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <input type="checkbox" bind:checked={form.shortDay} />
            <span>Sexta feira curta</span>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" bind:checked={form.computeLunchBreak} />
            <span>Adicionar horário de almoço (1h:30min)</span>
          </div>
        </div>
        <button class="bg-amber-400 text-white font-bold p-2">Calcular</button>
      </div>
    </form>
    {#if result !== undefined}
      <h1 class="text-3xl  text-amber-400 text-center mt-5">
        Horário saída {result.endTimeStr}
      </h1>
      {#if showTimer}
        <div class="w-100 flex items-center justify-center mt-5">
          <div
            class="clock-container bg-amber-400 flex items-center justify-center"
          >
            <div
              class="clock-content bg-amber-200 flex flex-col items-center justify-center"
            >
              <h1 class="text-3xl font-bold text-white">{countDown}</h1>
              <span class="text-white font-bold">Tempo restante</span>
            </div>
          </div>
        </div>
      {/if}
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

  .clock-container {
    width: 300px;
    height: 300px;
    border-radius: 50%;
  }

  .clock-content {
    width: 270px;
    height: 270px;
    border: 10px solid #fff;
    border-radius: 50%;
  }
</style>
