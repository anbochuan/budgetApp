// data module
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        // return sum;
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, id;
            // create new ID, ID = last ID + 1
            if(data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            // create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }
            // push it into our data structure
            data.allItems[type].push(newItem);
            console.log(data);
            return newItem;
        },
        calculateBudget: function () {
            // 1. calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');
            // 2. calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            // 3. calculate the percentage
            if (data.totals.inc > 0) { // this will avoid the infinity problem
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        // sumOfBudget: function () {
        //     data.budget = totalBudget('inc') - totalBudget('exp');
        // },
        // percentageOfBudget: function () {
        //     data.percentage = Math.round((totalBudget('exp') / totalBudget('inc')) * 100);
        // },
        getBudget: function () {
            // return an object with 4 properties
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }

    };

})();

// view UI module
var UIController = (function () {
    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function () {
            return { // return an object
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                // parseFloat() will convert the string to a floating number, otherwise we can not do calculations
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create HTML string with placeholder text
            if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>';
            } else if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // insert the HTML to DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function () {
            var fields, fieldsArr;
            // querySelectorAll method will return a list not an array
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            // convert the list to an array, set the 'this' variable to fields, which means fields can borrow the slice method from array
            // slice() can return a copy of an array that is called on
            fieldsArr = Array.prototype.slice.call(fields);
            // first parameter is current element (dom), second parameter is the index of the current element (dom)
            fieldsArr.forEach(function(current, index, array) {
                // set the content equals to empty
                current.value = "";
            });
            // make sure the cursor will focus on the first element (dom)
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

// controller module
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3. display the budget on UI
        UICtrl.displayBudget(budget);
    }


    var ctrlAddItem = function () {
        var input, newItem;
        // 1. get the field input data
        input = UICtrl.getInput();
        console.log(input);
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller (data structure)
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add the item to UI
            UICtrl.addListItem(newItem, input.type);
            // 4. clear the input fields
            UICtrl.clearFields();
            // 5. Calculate and update budget
            updateBudget();
        }
    };


    return {
        init: function() {
            console.log('App start...');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }



})(budgetController, UIController);

controller.init();