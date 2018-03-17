// data module
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        }

    };

})();

// view UI module
var UIController = (function () {
    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value

            };
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


    var ctrlAddItem = function () {
        var input, newItem;
        // 1. get the field input data
        input = UICtrl.getInput();
        console.log(input);

        // 2. add the item to the budget controller (data structure)
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. add the item to UI
        // 4. calculate the budget
        // 5. display the budget on UI

    };


    return {
        init: function() {
            console.log('App start...');
            setupEventListeners();
        }
    }



})(budgetController, UIController);

controller.init();