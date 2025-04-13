let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const tableBody = document.getElementById("transaction-table");
const balanceDisplay = document.getElementById("balance");
const filter = document.getElementById("filter");

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function calculateBalance() {
  let balance = 0;
  transactions.forEach(tx => {
    balance += tx.type === "income" ? tx.amount : -tx.amount;
  });
  balanceDisplay.textContent = balance.toFixed(2);
}

function renderTransactions(filterType = "all") {
  tableBody.innerHTML = "";
  const filtered = filterType === "all"
    ? transactions
    : transactions.filter(tx => tx.type === filterType);

  filtered.forEach((tx, index) => {
    const row = `<tr>
      <td>${tx.description}</td>
      <td>${tx.amount}</td>
      <td>${tx.type}</td>
      <td><button onclick="deleteTransaction(${index})">❌</button></td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateLocalStorage();
  calculateBalance();
  renderTransactions(filter.value);
  updateChart();
}

function addTransaction() {
  const desc = document.getElementById("desc").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!desc || isNaN(amount) || amount <= 0) return alert("Enter valid data!");

  transactions.push({ description: desc, amount, type });
  updateLocalStorage();
  calculateBalance();
  renderTransactions(filter.value);
  updateChart();

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

function filterTransactions() {
  renderTransactions(filter.value);
}

let chart;
function updateChart() {
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  if (chart) chart.destroy();
  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#28a745", "#dc3545"],
      }],
    },
  });
}

window.onload = () => {
  calculateBalance();
  renderTransactions();
  updateChart();
};
