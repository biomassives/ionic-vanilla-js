/* 
- function Constructor for building a lot of objects
- using object to save data, lots of variable
- function to devide small function to handle 
- 
*/
// Module pattern
// Model Controller
var modelController = function () {

  function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  function Expenses(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expenses.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expenses.prototype.getPercentages = function () {
    return this.percentage;
  };

  var data = {
    allItems: {
      inc: [],
      exp: [] },

    totals: {
      inc: 0,
      exp: 0 },

    budget: 0,
    percentage: -1 };


  return {
    //public function here

    addItem: function (type, desc, val) {
      var newItem, ID;
      // check length of type if have + 1 for ID else set ID to 0

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === 'exp') {
        newItem = new Expenses(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      data.allItems[type].push(newItem);

      return newItem;
    },

    calcBudget: function (type) {
      // calculate total income and expenses
      var sum = 0;
      data.allItems[type].forEach(function (current, index) {
        sum += current.value;
      });

      data.totals[type] = sum;
      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        // calculate the percentage of income that we spent
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
      } else {
        data.percentage = -1;
      }

    },

    getBudget: function () {
      return {
        incTotal: data.totals.inc,
        expTotal: data.totals.exp,
        percentage: data.percentage,
        budTotal: data.budget };

    },

    removeItemBudget: function (type, id) {

      // id = 4
      // ids [1 2 4 6 9]
      // index    2
      var index, ids;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculatePercentages: function () {
      // expenses Math.round((value / totalIncome)*100))
      data.allItems['exp'].forEach(function (curr) {
        // statements	
        curr.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentages();
      });
      return allPerc;
    },

    getCurrentMonth: function () {
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var now = new Date();
      var thisMonth = months[now.getMonth()];
      var thisYear = now.getFullYear();

      return thisMonth + ' ' + thisYear;
    } };

}();

// View Controller
var viewController = function () {

  //create domstring to change html class
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeList: '.income__list',
    expensesList: '.expenses__list',
    incomeTotal: '.budget__income--value',
    expensesTotal: '.budget__expenses--value',
    budgetTotal: '.budget__value',
    percentage: '.budget__expenses--percentage',
    container: '.container',
    currentMonth: '.budget__title--month',
    expensesPercent: '.item__percentage' };


  //return function to get public function outside scope
  return {
    // create function to get input data from UI
    // type, description and value
    getInputData: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value) };

    },

    displayItem: function (obj, type) {
      var newHTML, contentEl;

      if (type === 'inc') {

        contentEl = DOMstrings.incomeList;

        newHTML = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>' +
        '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">' +
        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      } else if (type === 'exp') {

        contentEl = DOMstrings.expensesList;

        newHTML = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
        '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percent%</div>' +
        '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
        '</div></div></div>';

      } else if (type === 'note') {

        contentEl = DOMstrings.expensesList;

        newHTML = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
        '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percent%</div>' +
        '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
        '</div></div></div>';

      }

      newHTML = newHTML.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', this.formatNumber(obj.value, type));

      document.querySelector(contentEl).insertAdjacentHTML('beforeend', newHTML);

    },

    removeListItem: function (id) {
      var itemID = document.getElementById(id);
      itemID.parentNode.removeChild(itemID);
    },

    clearFields: function () {
      var inputFields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      var arrFields = Array.prototype.slice.call(inputFields);
      // Array.from(inputFields)
      arrFields.forEach(function (cur) {
        cur.value = "";
      });

    },

    formatNumber: function (number, type) {
      /* method 1
      if (type && type !== "" && mindigits >=0 && 
      	maxdigits >=0 && !isNaN(mindigits) && !isNaN(maxdigits)) {
      		return number.toLocaleString(type,{minimumFractionDigits: mindigits,
      		maximumFractionDigits: maxdigits});
      	
      } else {
      	return number.toLocaleString('en',{minimumFractionDigits: 2});
      }*/

      var numSplit, int, dec, sign;

      number = Math.abs(number);
      number = number.toFixed(2);

      numSplit = number.split('.');

      int = numSplit[0];

      if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
      }

      dec = numSplit[1];

      return (type === 'exp' ? sign = '-' : sign = '+') + int + '.' + dec;

    },

    displayBudgetUI: function (obj) {

      var type;
      obj.budTotal > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.incomeTotal).textContent = this.formatNumber(obj.incTotal, 'inc');
      document.querySelector(DOMstrings.expensesTotal).textContent = this.formatNumber(obj.expTotal, 'exp');
      document.querySelector(DOMstrings.budgetTotal).textContent = this.formatNumber(obj.budTotal, type);
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentage).textContent = '----';
      }
    },

    displayPercentages: function (percentages) {

      var fields = document.querySelectorAll(DOMstrings.expensesPercent);

      var list = Array.prototype.slice.call(fields);
      list.forEach(function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });

    },

    displayCurrentMonth: function (month) {
      document.querySelector(DOMstrings.currentMonth).textContent = month;
    },

    changedType: function () {
      var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' +
      DOMstrings.inputValue);
      var btnField = document.querySelector(DOMstrings.inputBtn);

      btnField.classList.toggle('red');
      var arrFields = Array.prototype.slice.call(fields);

      arrFields.forEach(function (crr) {
        crr.classList.toggle('red-focus');
      });

    },

    // function return domstring
    getDOMStrings: function () {
      return DOMstrings;
    } };

}();

// Main Controller

var mainController = function (modelCtrl, viewCtrl) {

  var setupEventListeners = function () {
    var DOMstrings = viewCtrl.getDOMStrings();


    document.querySelector(DOMstrings.inputBtn).addEventListener('click', addItem);
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
      }
    });

    document.querySelector(DOMstrings.container).addEventListener('click', removeItem);
    document.querySelector(DOMstrings.inputType).addEventListener('change', viewCtrl.changedType);

  };

  var updatePercentages = function () {
    // expenses Math.round((value * total percen expenses) / total expenses))
    modelCtrl.calculatePercentages();

    var percentages = modelCtrl.getPercentages();
    viewCtrl.displayPercentages(percentages);
  };


  var calculateBudget = function () {

    // calculate total budget income - expenses
    modelCtrl.calcBudget('inc');
    modelCtrl.calcBudget('exp');
    // percentage = Math.round((exp/inc) *100)

    // 5. Get budget
    var budgetData = modelCtrl.getBudget();

    // 6. Display budget to the UI
    viewCtrl.displayBudgetUI(budgetData);

  };

  var addItem = function () {
    // 1. Get input data

    var inputData = viewCtrl.getInputData();

    // 2. Add item to income or expenses
    if (inputData.description !== "" && !isNaN(inputData.value) && inputData.value > 0) {

      var newItem = modelCtrl.addItem(inputData.type, inputData.description, inputData.value);

      // 3. Display item to the UI
      viewCtrl.displayItem(newItem, inputData.type);
      // Clearing the input fields after click or enter
      viewCtrl.clearFields();
      calculateBudget();
      updatePercentages();

    }

  };

  var removeItem = function (event) {
    var itemID, type, id, item;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      item = itemID.split('-');
      type = item[0];
      id = parseInt(item[1]);
      modelCtrl.removeItemBudget(type, id);
      viewCtrl.removeListItem(itemID);
      calculateBudget();
      updatePercentages();

    }

  };

  return {
    init: function () {
      console.log('Application was started');
      viewCtrl.displayCurrentMonth(modelCtrl.getCurrentMonth());
      setupEventListeners();
    } };


}(modelController, viewController);

mainController.init();
