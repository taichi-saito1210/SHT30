main();

async function main() {
  const temperatureDisplay = document.getElementById("temperatureDisplay");
  const humidityDisplay = document.getElementById("humidityDisplay");
  const i2cAccess = await navigator.requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const sht30 = new SHT30(port, 0x44);
  await sht30.init();

  while (true) {
    const { humidity, temperature } = await sht30.readData();
    temperatureDisplay.innerHTML = `${temperature.toFixed(2)} ℃`;
    humidityDisplay.innerHTML = `${humidity.toFixed(2)} %`;
    if (humidity.toFixed(2) > 75) {
      // const gpioAccess = await navigator.requestGPIOAccess(); // GPIO を操作する
      // const port = gpioAccess.ports.get(26); // 26 番ポートを操作する
      // await port.export("out"); // ポートを出力モードに設定
      // await port.write(1); // LED を点灯

      const button = document.getElementById("button");
      const ledView = document.getElementById("ledView");
      const gpioAccess = await navigator.requestGPIOAccess();
      const ledPort = gpioAccess.ports.get(26); // LED の GPIO ポート番号
      await ledPort.export("out");
      const switchPort = gpioAccess.ports.get(5); // タクトスイッチの GPIO ポート番号
      await switchPort.export("in");
      // await ledPort.write(1);
      // await sleep(200);
      var i;
      for (i = 0; i < 5; i++) {
        await ledPort.write(1);
        await sleep(200);
        await ledPort.write(0);
        await sleep(200);
      }
    }
    if (humidity.toFixed(2) <= 75) {
      // const gpioAccess = await navigator.requestGPIOAccess(); // GPIO を操作する
      // const port = gpioAccess.ports.get(26); // 26 番ポートを操作する
      // await port.export("out"); // ポートを出力モードに設定
      // await port.write(0); // LED を消灯

      const button = document.getElementById("button");
      const ledView = document.getElementById("ledView");
      const gpioAccess = await navigator.requestGPIOAccess();
      const ledPort = gpioAccess.ports.get(26); // LED の GPIO ポート番号
      await ledPort.export("out");
      const switchPort = gpioAccess.ports.get(5); // タクトスイッチの GPIO ポート番号
      await switchPort.export("in");
      await ledPort.write(0);
    }
    await sleep(200);
  }
    await sleep(500);
  }
}
