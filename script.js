function formatDateAndTime(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

function updateCurrencyInfo(selectedCurrencyCode, jsonData) {
    const currencyInfoDiv = document.getElementById('currencyInfo');

    const selectedCurrency = jsonData.Valute[selectedCurrencyCode];

    if (selectedCurrency) {
        const currencyIdNameElement = document.getElementById('currencyIdName');
        currencyIdNameElement.textContent = `${selectedCurrency.ID} - ${selectedCurrency.Name}`;

        document.getElementById('currencyCode').textContent = selectedCurrency.CharCode;

        const currencyDateValueElement = document.getElementById('currencyDateValue');
        currencyDateValueElement.textContent = `${formatDateAndTime(jsonData.Date)} - ${selectedCurrency.Value.toFixed(4)}`;

        const prevCurrencyDateValueElement = document.getElementById('prevCurrencyDateValue');
        prevCurrencyDateValueElement.textContent = `${formatDateAndTime(jsonData.PreviousDate)} - ${selectedCurrency.Previous.toFixed(4)}`;
    } else {
        currencyInfoDiv.innerHTML = '<p>Выберите валюту из списка.</p>';
    }
}

const currencySelect = document.getElementById('currencySelect');

fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(response => response.json())
    .then(jsonData => {

        Object.keys(jsonData.Valute).forEach(currencyCode => {
            const option = document.createElement('option');
            option.value = currencyCode;
            option.textContent = `${jsonData.Valute[currencyCode].ID} - ${jsonData.Valute[currencyCode].Name}`;
            currencySelect.appendChild(option);
        });

        function populateCurrencyOptions() {
            const valute = jsonData.Valute;
            for (const currencyId in valute) {
                const option = document.createElement('option');
                option.value = currencyId;
                option.textContent = `${valute[currencyId].ID} - ${valute[currencyId].Name}`;
                currencySelect.appendChild(option);
            }
        }
        currencySelect.addEventListener('change', event => {
            const selectedCurrencyCode = event.target.value;
            updateCurrencyInfo(selectedCurrencyCode, jsonData);
        });

        const firstCurrencyCode = Object.keys(jsonData.Valute)[0];
        updateCurrencyInfo(firstCurrencyCode, jsonData);

        populateCurrencyOptions();
        currencyInfoDiv.style.display = 'none';

        const initialOption = document.createElement('option');
        initialOption.disabled = true;
        initialOption.selected = true;
        initialOption.textContent = 'Выберите валюту';
        currencySelect.appendChild(initialOption);
    })
    .catch(error => {
        console.error('Ошибка при загрузке JSON:', error);
    });
