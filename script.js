const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const allColumnLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlogList');
const progressList = document.getElementById('progressList');
const completeList = document.getElementById('completeList');
const onHoldList = document.getElementById('onHoldList');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((name, index) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(filterArray(listArrays[index])));
  })
}

// Filter Arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append the lists to Parent ul
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) { getSavedColumns(); }
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  listArrays.forEach((array, i) => {
    allColumnLists[i].textContent = '';
    array.forEach((listLogItem, index) => {
      createItemEl(allColumnLists[i], i, listLogItem, index);
    })
  })
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if blank, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = allColumnLists[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// Add text to Column List and Reset input Box
function addToList(column) {
  const itemText = addItems[column].textContent;
  listArrays[column].push(itemText);
  console.log(listArrays[column]);
  if (itemText !== '') { updateDOM(); }
  itemText = '';
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}
// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToList(column);
}

// Store new value of drag and drop into array
function updateArrays() {
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  updateDOM();
}

// When item dragging start functio
function drag(e) {
  // console.log('drag start');
  e.target.classList.add('dragging');
  draggedItem = e.target;
  dragging = true;
}
// Allow HTML Element drop function
function allowDrop(e) {
  e.preventDefault();
}
// When item enters droppable are function
function dragEnter(columnInt) {
  allColumnLists[columnInt].classList.add('over');
  currentColumn = columnInt;
}
// When HTML element is dropped function
function drop(e) {
  e.preventDefault();
  allColumnLists.forEach((column) => {
    column.classList.remove('over');
  });
  // Add Dropped Element to the column
  const newParent = allColumnLists[currentColumn];
  newParent.appendChild(draggedItem);
  dragging = false;
  updateArrays();
}
// On Load
updateDOM();