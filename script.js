const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const netBalance = document.getElementById("net-balance");
const transactionsList = document.getElementById("transactions-list");

// LOAD TRANSACTIONS FROM LOCAL STORAGE
let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];

// SHOW SAVED TRANSACTIONS WHEN PAGE LOADS
renderTransactions();
updateSummary();

// SAVE TO LOCAL STORAGE
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ADD NEW TRANSACTION
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (description && !isNaN(amount) && type) {
    const transaction = {
      description: description,
      amount: amount,
      type: type,
    };

    transactions.push(transaction);

    saveTransactions();
    updateSummary();
    renderTransactions();

    transactionForm.reset();
  }
});

// UPDATE SUMMARY
function updateSummary() {
  let income = 0;
  let expenses = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else if (transaction.type === "expense") {
      expenses += transaction.amount;
    }
  });

  totalIncome.textContent = income.toFixed(2);
  totalExpenses.textContent = expenses.toFixed(2);
  netBalance.textContent = (income - expenses).toFixed(2);
}

// ADD TRANSACTION TO SCREEN
function addTransactionToList(transaction, index) {
  const li = document.createElement("li");

  li.classList.add(transaction.type);

  li.innerHTML = `
    <div class="transaction-info">
      <strong>
        ${transaction.description}: $${transaction.amount.toFixed(2)}
      </strong>

      <small>${transaction.type}</small>
    </div>

    <button class="delete-btn">×</button>
  `;

  const deleteButton = li.querySelector(".delete-btn");

  // DELETE TRANSACTION
  deleteButton.addEventListener("click", function () {
    transactions.splice(index, 1);

    saveTransactions();
    updateSummary();
    renderTransactions();
  });

  transactionsList.appendChild(li);
}

// RENDER ALL TRANSACTIONS
function renderTransactions() {
  transactionsList.innerHTML = "";

  transactions.forEach(function (transaction, index) {
    addTransactionToList(transaction, index);
  });
}