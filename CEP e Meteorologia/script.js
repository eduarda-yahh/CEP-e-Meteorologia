document.getElementById("buscar").addEventListener("click", async () => {
  const cep = document.getElementById("cep").value.trim();
  const enderecoDiv = document.getElementById("endereco");
  const climaDiv = document.getElementById("clima");

  enderecoDiv.style.display = "none";
  climaDiv.style.display = "none";

  if (cep === "") {
    alert("Por favor, digite um CEP!");
    return;
  }

  try {
    // 🔹 Consulta na API ViaCEP
    const viaCepUrl = `https://viacep.com.br/ws/${cep}/json/`;
    const resposta = await fetch(viaCepUrl);
    const dados = await resposta.json();

    if (dados.erro) {
      alert("CEP não encontrado!");
      return;
    }

    // Exibe os dados do endereço
    enderecoDiv.innerHTML = `
      <h3>Endereço Encontrado:</h3>
      <p><strong>Logradouro:</strong> ${dados.logradouro}</p>
      <p><strong>Bairro:</strong> ${dados.bairro}</p>
      <p><strong>Cidade:</strong> ${dados.localidade}</p>
      <p><strong>UF:</strong> ${dados.uf}</p>
    `;
    enderecoDiv.style.display = "block";

    // 🔹 Busca a meteorologia na API OpenWeatherMap
    const cidade = dados.localidade;
    const apiKey = "4b4a945afb935ad25ebe8bf59c1d0927";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade},BR&units=metric&lang=pt_br&appid=${apiKey}`;

    const climaResposta = await fetch(weatherUrl);
    const climaDados = await climaResposta.json();

    if (climaDados.cod !== 200) {
      climaDiv.innerHTML = "<p>Não foi possível obter a meteorologia.</p>";
    } else {
      climaDiv.innerHTML = `
        <h3>Clima em ${cidade}</h3>
        <p><strong>Temperatura:</strong> ${climaDados.main.temp}°C</p>
        <p><strong>Condição:</strong> ${climaDados.weather[0].description}</p>
        <p><strong>Umidade:</strong> ${climaDados.main.humidity}%</p>
        <p><strong>Vento:</strong> ${climaDados.wind.speed} m/s</p>
      `;
    }

    climaDiv.style.display = "block";
  } catch (error) {
    alert("Erro ao buscar informações. Verifique o CEP ou a conexão.");
    console.error(error);
  }
});
