

// Seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.querySelector("#amount")
const expense = document.querySelector("#expense")
const category = document.querySelector("#category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor
amount.addEventListener("input", () => {
  // Obtém o valor autal do input e remove os caracteres não númericos.
  let value = amount.value.replace(/\D/g, "")

  // Transformar o valor em centavos
  value = Number(value) / 100
  
  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
})

function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  // Retorna o valor formatado
  return value
}

// Captura o evento de submit do formulário para obter os valores
form.addEventListener("submit", (event) => {
  // Previne o comportamento padrão de recarregar a página
  event.preventDefault()

  // Cria um objeto com os detalhes da nova despesa
  const newExprense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  }

  // Chama a função que irá adicionar a lista
  expenseAdd(newExprense)
})

// Adicionar um novo item na lista.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despensa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // Cria o icone de remover os itens da lista
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remover item da lista")

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adicona o item na lista
    expenseList.append(expenseItem)

    // Limpa o formulario para adicionar um novo item
    formClear()

    // Atualiza os totais
    updateTotals()

  } catch(error) {
    alert("Não foi possivel atualizar a lista de despesas")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children
    
    // Atualiza a quantidade de itens da lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variavel para incrementar o total.
    let total = 0

    // Percorre ca item (li) da lista (ul)
    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
      
      // Remove caracters não nméricos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      // Converte o valor para float
      value = parseFloat(value)

      // Verificar se é um número válido.
      if(isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parecer ser um número.")
      }

      // Incrementar o valor total.
      total += Number(value)
    }

    // Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteudo do elemento
    expenseTotal.innerHTML = ""

    // Adiciona o simbolo da moeda e o valor total
    expenseTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error)
    alert("Não foi possivel atualizar os totais.")
  }
}

// Evento que captura o clique nos ites da lista
expenseList.addEventListener("click", (event) => {
  // Verificar se o elemento clicado é o ícone de remover
  if(event.target.classList.contains("remove-icon")) {
    // obtém a (li) pai d elemento clicado
    const item = event.target.closest(".expense")
    
    // Remove o item da lista
    item.remove()
  }

  // Atualiza alista
  updateTotals()
})

function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}