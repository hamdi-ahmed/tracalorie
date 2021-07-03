// Storage Controller
const StorageCtrl = (() => {
    // Public Function
    return {
        saveItemInStorage: item => {
            let items;

            // Check if something in local storage
            localStorage.getItem('Items') === null ?
                items = [] :
                items = JSON.parse(localStorage.getItem('Items'))

            // Push to Array
            items.push(item)

            // Set local storage
            localStorage.setItem('Items', JSON.stringify(items))
        },
        getItemsFromStorage: () => {
            let items;
            localStorage.getItem('Items') === null ?
                items = [] :
                items = JSON.parse(localStorage.getItem('Items'))

            return items
        },

        // Update in LocalStorage
        updateItemInStorage: updatedItem => {
            let items = JSON.parse(localStorage.getItem('Items'))
            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem('Items', JSON.stringify(items))
        },

        // Delete From Storage
        deleteItemFromStorage: id => {
            let items = JSON.parse(localStorage.getItem('Items'))
            items.forEach((item, index) => {
                if (item.id === id) {
                    items.splice(index, id)
                }
            })
            localStorage.setItem('Items', JSON.stringify(items))
        },

        // Delete All Items From Storage
        removeAllItemsFromStorage: () => {
            localStorage.removeItem('Items')
        }
    }
})()

// Items Controller
const ItemsCtrl = (() => {
    const Item = function (id, name, calories) {
        this.id = id,
            this.name = name,
            this.calories = calories
    }

    const data = {
        // items: [
        //     // { id: 0, name: 'Dinner Steak', calories: 1200 },
        //     // { id: 1, name: 'Cookie', calories: 400 },
        //     // { id: 2, name: 'Egg', calories: 200 },
        // ]
        items: StorageCtrl.getItemsFromStorage(),
        totalCalories: 0,
        currentItems: null
    }

    return {
        getItems: () => {
            return data.items
        },
        logData: () => {
            return data
        },

        getCurrentItem: () => {
            return data.currentItems
        },

        addDataItems: (name, calorie) => {
            //console.log(name);
            let ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }

            // Convert Calories from string to number
            calorie = parseInt(calorie)

            // Take a new Obj
            newItem = new Item(ID, name, calorie)

            // push to array
            data.items.push(newItem)
            return newItem
        },

        // Calculate The Calories
        calculateCalories: () => {
            let total = 0
            data.items.forEach(function (item) {
                total += item.calories
            })
            data.totalCalories = total
            return data.totalCalories
        },
        // Get The Item Data By Id
        getItemsById: id => {
            // Get The Element Obj
            let dataItem
            dataItem = data.items.find(item => item.id === id)
            return dataItem
        },

        // Update Current Items
        setCurrentItems: item => {
            data.currentItems = item
            return data.currentItems
        },
        // Update Item In Data Structure
        updateItem: ({ name, calorie }) => {
            calorie = parseInt(calorie)
            let found = null
            data.items.map(item => {
                if (item.id === data.currentItems.id) {
                    item.name = name,
                        item.calories = calorie,
                        found = item
                }
            })
            return found
        },

        // Delete The Item From Data
        deleteItem: (id) => {
            const ids = data.items.map(item => {
                return item.id
            })

            // Get the index 
            const index = ids.indexOf(id)

            // Remove 
            data.items.splice(index, 1)
        },

        // Delete All Items
        deleteAllItems: () => {
            data.items = []
        },
    }
})()

// UICtrl
const UICtrl = (() => {
    // Declare UISelectors
    const UISelectors = {
        itemsList: 'item-list',
        heading: '.heading',
        addBtn: '.btn-add',
        updateBtn: '.btn-update',
        removeBtn: '.btn-delete',
        backBtn: '.btn-back',
        calorieName: 'calorieName',
        calorieQty: 'calorieQty'
    }
    return {
        // Print Items Food in the DOM
        getPopulateListItems: items => {
            let output = ''
            items.map(item => {
                output += ` 
                    <li id="item-${item.id}" class="list-group-item">
                        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                         <a href="#" class="btn btn-warning" style="float:right"
                         ><i class="fa fa-pencil-square-o"></i
                        ></a>
                     </li>
                `
            })
            document.getElementById(UISelectors.itemsList).innerHTML = output

        },

        // Get Name and Calories Value
        getAddItems: function () {
            return {
                name: document.getElementById(UISelectors.calorieName).value,
                calorie: document.getElementById(UISelectors.calorieQty).value,
            }
        },


        // Add New Item to UI
        addNewItems: function (item) {
            //console.log(item);
            const li = document.createElement('li')
            li.className = 'list-group-item'
            li.id = `item-${item.id}`
            li.innerHTML = ` 
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a style="float:right" href="#" class="btn btn-warning float-right"
                    ><i class="edit-item fa fa-pencil-square-o"></i
                ></a>
            `
            //console.log(li.children[2])

            document.getElementById(UISelectors.itemsList).insertAdjacentElement('beforeend', li)
            document.querySelector(`#${UISelectors.itemsList}`).style.display = 'flex'
        },

        // Clear Input after Inserting 
        clearInput: () => {
            document.getElementById(UISelectors.calorieName).value = ''
            document.getElementById(UISelectors.calorieQty).value = ''
        },

        // Hide ul if there is no items
        hideMenuItems: () => {
            document.querySelector(`#${UISelectors.itemsList}`).style.display = 'none'
        },

        // Add Total Calories 
        addTotalCalories: (calories) => {
            document.querySelector(UISelectors.heading).textContent = `Total Calories: ${calories}`
        },

        // Hide Buttons in Adding State
        clearEditState: () => {
            UICtrl.clearInput()
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.removeBtn).style.display = 'none'
            document.querySelector(UISelectors.updateBtn).style.display = 'none'

        },



        // Edit Buttons On UI
        addItemToForm: item => {
            document.getElementById(UISelectors.calorieName).value = item.name
            document.getElementById(UISelectors.calorieQty).value = item.calories
            UICtrl.showEditState()
        },

        // Show Edit State
        showEditState: () => {
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.removeBtn).style.display = 'inline'
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'

        },

        // Update Item In UI
        updateItemInUI: (item) => {
            //console.log(item);
            let listItems = document.querySelectorAll('ul li')
            listItems = Array.from(listItems)
            listItems.forEach(listItem => {
                const ItemID = listItem.getAttribute('id') // item-0
                if (ItemID === `item-${item.id}`) {
                    document.querySelector(`#${ItemID}`).innerHTML = ` 
                        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                        <a style="float:right" href="#" class="btn btn-warning float-right"
                            ><i class="edit-item fa fa-pencil-square-o"></i
                        ></a>     
                    `
                }
            })
        },


        // Delete Single List From UI
        deleteItemList: id => {
            const ID = `#item-${id}`
            const itemList = document.querySelector(ID)
            itemList.remove()
        },

        // Delete All List From UI
        removeAllItems: () => {
            let listItems = document.querySelectorAll('ul li')
            listItems = Array.from(listItems)
            listItems.forEach((list) => {
                list.remove()
            })
        },

        // Access to UISelectors to App Controller
        getUISelector: () => UISelectors
    }
})()

// App Controller
const App = ((ItemsCtrl, StorageCtrl, UICtrl) => {
    // Load Event Listener
    const loadEvent = () => {
        const selectors = UICtrl.getUISelector()
        // Event on Add Meal Button
        document.querySelector(selectors.addBtn).addEventListener('click', addItems)

        // Event on Edit Icon
        document.getElementById(selectors.itemsList).addEventListener('click', getId)

        // Disable Enter Key While Submit
        document.addEventListener('keypress', e => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })

        // Event On Update Button
        document.querySelector(selectors.updateBtn).addEventListener('click', itemUpdateSubmit)

        // Event On Delete Button
        document.querySelector(selectors.removeBtn).addEventListener('click', itemClickDelete)

        // Event On Back Button
        document.querySelector(selectors.backBtn).addEventListener('click', UICtrl.clearEditState)

        // Event On Clear All
        document.querySelector('.clear-btn').addEventListener('click', clearAllItems)
    }

    // Add Items
    const addItems = e => {
        // AddItemsRow
        const input = UICtrl.getAddItems()
        //console.log(input.name);
        if (input.name !== '' && input.calorie !== '') {
            //console.log('123');
            const newItem = ItemsCtrl.addDataItems(input.name, input.calorie)
            // Add Item to UI
            UICtrl.addNewItems(newItem)

            const items = ItemsCtrl.getItems()

            // Create the function and return  The Total Calories 
            const totalCalories = ItemsCtrl.calculateCalories()

            // Add Total Calories To The UI
            UICtrl.addTotalCalories(totalCalories)

            // Local Storage
            StorageCtrl.saveItemInStorage(newItem)

            // Clear Input
            UICtrl.clearInput()
        }
        e.preventDefault()
    }

    // Update Item
    const itemUpdateSubmit = (e) => {
        // Get The input Value
        const input = UICtrl.getAddItems()

        // Update In Data Structure
        const updatedItem = ItemsCtrl.updateItem(input)

        // Update Items In UI
        UICtrl.updateItemInUI(updatedItem)

        // Create the function and return  The Total Calories 
        const totalCalories = ItemsCtrl.calculateCalories()

        // Add Total Calories To The UI
        UICtrl.addTotalCalories(totalCalories)

        // Clear Edit State
        UICtrl.clearEditState()

        // Update In Local Storage
        StorageCtrl.updateItemInStorage(updatedItem)

        e.preventDefault()
    }

    // Delete Item
    const itemClickDelete = e => {
        e.preventDefault()

        // Get Current Item
        const currentItem = ItemsCtrl.getCurrentItem()

        // Delete In Data Structure
        ItemsCtrl.deleteItem(currentItem.id)

        // Delete From UI
        UICtrl.deleteItemList(currentItem.id)

        // Create the function and return  The Total Calories 
        const totalCalories = ItemsCtrl.calculateCalories()

        // Add Total Calories To The UI
        UICtrl.addTotalCalories(totalCalories)

        // Delete In Storage
        StorageCtrl.deleteItemFromStorage(currentItem.id)

        // Clear Edit State
        UICtrl.clearEditState()

    }

    const clearAllItems = e => {
        e.preventDefault()

        // Clear From DS
        ItemsCtrl.deleteAllItems()

        // Clear All Items From UI
        UICtrl.removeAllItems()

        // Create the function and return  The Total Calories 
        const totalCalories = ItemsCtrl.calculateCalories()

        // Add Total Calories To The UI
        UICtrl.addTotalCalories(totalCalories)

        // Clear All Items From Storage
        StorageCtrl.removeAllItemsFromStorage()

        // Clear Input
        UICtrl.clearInput()
    }

    // Get Id From The Item We Added
    const getId = (e) => {
        e.preventDefault()
        if (e.target.classList.contains('edit-item') || e.target.classList.contains('fa')) {
            // Get The Id and Convert It into a number
            const id = parseInt(e.target.parentNode.parentNode.id.split('-')[1])
            //console.log(id);

            // Get The Items By ID
            const itemToEdit = ItemsCtrl.getItemsById(id)

            // update
            const items = ItemsCtrl.setCurrentItems(itemToEdit)

            // Edit in UI
            UICtrl.addItemToForm(items)
        }
    }

    return {
        init: () => {
            // First, Show Button and Clear State
            UICtrl.clearEditState()

            // Fetch Items
            const items = ItemsCtrl.getItems()

            // Create the function and return  The Total Calories 
            const totalCalories = ItemsCtrl.calculateCalories()

            // Add Total Calories To The UI
            UICtrl.addTotalCalories(totalCalories)

            if (items.length === 0) {
                UICtrl.hideMenuItems()

            } else {
                UICtrl.getPopulateListItems(items)
            }

            // Load Event Listener
            loadEvent()
        }
    }

})(ItemsCtrl, StorageCtrl, UICtrl)


// Run App
App.init()