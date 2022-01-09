<script>
  import { onMount } from "svelte";
  import Switch from "./components/Switch.svelte";

  let result = undefined;
  let interval = undefined;
  let showTimer = false;
  let countDown = "";
  let darkMode = true;

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

  function setCurrentTime() {
    const now = new Date();
    form.startHour = now.getHours();
    form.startMinutes = now.getMinutes();
  }

  function getTimeDistance(date = new Date()) {
    const now = Date.now();
    const dateTime = date.getTime();
    return dateTime - now;
  }

  async function handleSubmit() {
    result = getWorkJourneyInfo(form);

    clearInterval(interval);
    const distance = getTimeDistance(result.endDate);

    if (distance < 0) {
      showTimer = false;
      return;
    }

    interval = setInterval(function () {
      const distance = getTimeDistance(result.endDate);

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countDown = `${hours}h ${minutes}m ${seconds}s`;
      showTimer = true;

      result.startDate.setSeconds(result.startDate.getSeconds() + 1);
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

    const startTimeStr = `${start.getHours()}:${start.getMinutes()}`;
    const startDate = new Date(start);

    start.setMinutes(
      start.getMinutes() + (computeLunchBreak ? lunchBreakMinutes : 0)
    );
    start.setHours(
      start.getHours() + (shortDay ? shortDayHours : normalDayHours)
    );
    start.setMinutes(
      start.getMinutes() + (shortDay ? shortDayMinutes : normalDayMinutes)
    );

    let endTimeStr = `${
      start.getHours() < 10 ? `0${start.getHours()}h` : `${start.getHours()}h`
    } : ${
      start.getMinutes() < 10 ? `0${start.getMinutes()}min` : `${start.getMinutes()}min` 
    }`;

    const endDate = start;

    return {
      startTimeStr,
      endTimeStr,
      startDate,
      endDate,
    };
  }

  function toggleTheme() {
    darkMode = !darkMode;
  }

  onMount(() => {
    setCurrentTime();
  });
</script>

<main class="{darkMode ? 'dark' : 'light'} pt-2">
  <div class="main-container ">
    <div class="flex justify-end">
      <div class="flex gap-2">
        <span class="font-bold theme-label">Modo</span>
        <Switch id="switch-theme" value={darkMode} on:click={toggleTheme} />
      </div>
    </div>
    <h1 class="text-4xl text-center title text-amber-400 mb-5">
      Calcular horário de saída
    </h1>
    <form on:submit|preventDefault={handleSubmit}>
      <span class="time-label">Horário de entrada</span>

      <div class="flex items-center">
        <select class="p-2 select w-100" bind:value={form.startHour}>
          {#each hours as hour}
            <option disabled={hour.value <= 5} value={hour.value}
              >{hour.formatedValue}</option
            >
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
            <input
              id="short-friday"
              type="checkbox"
              bind:checked={form.shortDay}
            />
            <label for="short-friday">Sexta feira curta</label>
          </div>
          <div class="flex items-center gap-2">
            <input
              id="lunch-time"
              type="checkbox"
              bind:checked={form.computeLunchBreak}
            />
            <label for="lunch-time"
              >Adicionar horário de almoço (1h:30min)</label
            >
          </div>
        </div>
        <button class="bg-amber-400 text-white font-bold p-2 submit-button"
          >Calcular</button
        >
      </div>
    </form>
    {#if result !== undefined}
      <h1 class="text-3xl result-text text-center mt-5">
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
              <h1 class="text-3xl font-bold text-black">{countDown}</h1>
              <span class="text-black font-bold">Tempo restante</span>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</main>

<style lang="scss">
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

  option:disabled {
    background-color: rgb(248 250 252);
  }

  .submit-button {
    color: #000;
  }

  main {
    height: 100%;
    $color-dark: rgb(251 191 36);
    $color-light: #565656;

    &.dark {
      background-color: #000;
      .theme-label {
        color: $color-dark;
      }
      .title {
        color: $color-dark;
      }

      .time-label {
        color: $color-dark;
      }

      form {
        label {
          color: $color-dark;
        }
      }

      .result-text {
        color: $color-dark;
      }

      .clock-content {
        border-color: #000;
      }
    }

    &.light {
      background-color: #fff;

      .theme-label {
        color: $color-light;
      }

      .title {
        color: $color-light;
      }

      .time-label {
        color: $color-light;
      }

      form {
        label {
          color: $color-light;
        }
      }

      .result-text {
        color: $color-light;
      }
    }
  }
</style>
